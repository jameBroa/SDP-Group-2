import * as React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import VideoPlayer from '../../components/VideoPlayer';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useLocalSearchParams } from 'expo-router';

export default function Playback() {
    const user = useSelector((state) => state.user.user);
    const { session } = useLocalSearchParams();

    const [videos, setVideos] = React.useState([]);

    const fetchVideos = async () => {
      try {
        const storage = getStorage();
        const sessionRef = ref(storage, `videos/${user.uid}/${session}`);
        const items = await listAll(sessionRef); // List all items (videos) in the session directory
        
        console.log("session: " + session)
        console.log("items: " + items.items) ;
        await Promise.all(items.items.map(async (item) => {
            const url = await getDownloadURL(item); // Get download URL for each video
            if (videos.includes(url) == false) {
                setVideos(prevVideos => [...prevVideos, url]); // Push URL to videoURLs array
            }
        }));
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    React.useEffect(() => {
      fetchVideos(); // Fetch videos for the session when component mounts
    }, []);

    return (
      <ScrollView contentContainerStyle={styles.wrapper} className="w-full flex flex-col space-y-1">
          <View style={styles.container}>
              {videos.map((url, index) => (
                  <VideoPlayer key={index} url={url} />
              ))}
              {videos.size === 0 && <Text>No videos found</Text>}
          </View>
      </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    wrapper: {
        justifyContent: 'between',
    },
});
