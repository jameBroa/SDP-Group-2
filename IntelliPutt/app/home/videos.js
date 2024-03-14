import * as React from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import VideoPlayer from '../../components/Video';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import ReduxStateUpdater from '../../context/util/updateState';

export default function VideosPage() {
    const user = useSelector((state) => state.user.user);
    const [videosBySession, setVideosBySession] = React.useState(new Map());
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        ReduxStateUpdater.fetchSessions(user);
        setTimeout(() => setRefreshing(false), 1000);
    }, [])

    const fetchVideosForAllSessions = async () => {
        try {
            const storage = getStorage();
            const videosMap = new Map();

            // Iterate over each session       
            await Promise.all(user.sessions.map(async (session) => {
                const sessionRef = ref(storage, `videos/${user.uid}/${session}`);
                console.log(sessionRef.items); 
                const videoURLs = [];
                const items = await listAll(sessionRef); // List all items (videos) in the session directory
                await Promise.all(items.items.map(async (item) => {
                    const url = await getDownloadURL(item); // Get download URL for each video
                    videoURLs.push(url); // Push URL to videoURLs array
                }));
                videosMap.set(session, videoURLs); // Store video URLs in the map
            }));

            setVideosBySession(videosMap); // Set state with map of video URLs indexed by session ID
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    React.useEffect(() => {
        fetchVideosForAllSessions(); // Fetch videos for the session when component mounts
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.wrapper} className="w-full flex flex-col space-y-1"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
            <View style={styles.container}>
                {Array.from(videosBySession).map(([sessionID, videoURLs]) => (
                    <View key={sessionID}>
                        <Text>Session: {sessionID}</Text>
                        {videoURLs.map((url, index) => (
                            <VideoPlayer key={index} url={url} />
                        ))}

                        {videoURLs.length === 0 && <Text>No videos for this session</Text>}
                    </View>
                ))}
                {videosBySession.size === 0 && <Text>No videos found</Text>}
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

