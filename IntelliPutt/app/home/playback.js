import * as React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import VideoPlayer from '../../components/VideoPlayer';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import BackButton from '../../components/BackButton';

export default function Playback() {
    const user = useSelector((state) => state.user.user);
    const { session, date } = useLocalSearchParams();

    const [videos, setVideos] = React.useState([]);

    const fetchVideos = async () => {
      try {
        const storage = getStorage();
        const sessionRef = ref(storage, `videos/${user.uid}/${session}`);
        const items = await listAll(sessionRef); // List all items (videos) in the session directory
        
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
        <View className="w-full h-full flex flex-col items-center bg-brand-colordark-green">
            <Stack.Screen options={{headerShown:false}}></Stack.Screen>
            <View className="h-[30%] w-full items-center justify-center mb-4">
                <BackButton className="h-[5%]" action={() => router.back()} />
                <View className="flex-row justify-end items-center mb-10 absolute left-[10%] top-[80%]">
                    <View className="flex-row mb-2">
                        <Text className="font-semibold text-3xl text-stone-50">Videos from {date}</Text>
                    </View>
                </View>
            </View>     
            <ScrollView contentContainerStyle={styles.wrapper} className="w-full flex flex-col space-y-1 rounded-2xl">
                <View style={styles.container}>
                    {videos.map((url, index) => (
                        <VideoPlayer key={index} url={url} />
                    ))}
                    {videos.size === 0 && <Text>No videos found</Text>}
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        paddingTop: 50,
        paddingBottom: 30
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
