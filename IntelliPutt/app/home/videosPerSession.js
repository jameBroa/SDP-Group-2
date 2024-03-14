import * as React from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import VideoPreview from '../../components/VideoPreview';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import ReduxStateUpdater from '../../context/util/updateState';
import { Link } from 'expo-router';

export default function VideosPerSession() {
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
        <ScrollView contentContainerStyle={styles.wrapper} className="w-full h-full flex flex-col space-y-1"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
            <View style={styles.container} className="h-full my-2 py-2">
                {Array.from(videosBySession).map(([sessionID, videoURLs]) => (
                    <View key={sessionID} className="items-center justify-evenlyh-full bg-brand-colordark-green rounded-2xl py-5 mx-3">
                        <Text className="text-base text-stone-50 font-semibold">{sessionID}</Text>
                        
                        <Link className="flex flex-row max-w-[50%] m-0 py-2 justify-center" href={{
                            pathname: "/home/playback",
                            params: { session: sessionID },
                            }}>
                            {videoURLs.slice(0, 2).map((url, index) => (
                                <VideoPreview key={index} url={url} />
                            ))}
                        </Link>

                        <Text className="text-stone-50">View all</Text>

                        {videoURLs.length === 0 && <Text>No videos for this session</Text>}
                    </View>

                ))}
                {videosBySession.size === 0 && <Text>No videos found</Text>}
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    wrapper: {
        justifyContent: 'between',
    },
});

