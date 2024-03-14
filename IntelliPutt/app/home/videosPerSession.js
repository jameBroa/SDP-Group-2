import * as React from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import VideoPreview from '../../components/VideoPreview';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import ReduxStateUpdater from '../../context/util/updateState';
import { Link, Stack, router } from 'expo-router';
import BackButton from '../../components/BackButton';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import db from '../../config/database';

export default function VideosPerSession() {
    const user = useSelector((state) => state.user.user);
    const [sessionID, setSessionID] = React.useState(new Map());
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        ReduxStateUpdater.fetchSessions(user);
        setTimeout(() => setRefreshing(false), 1000);
    }, [])

    const fetchSessionsWithVideos = async () => {
        try {
            const storage = getStorage();
            
            console.log("Session data: ", user.sessions);
            // Iterate over each session       
            await Promise.all(user.sessions.map(async (session) => {
                const sessionRef = ref(storage, `videos/${user.uid}/${session}`);
                const items = await listAll(sessionRef); // List all items (videos) in the session directory
                
                // If there are videos in the session, add the session to the state
                if (items.items.length > 0) {
                    getDoc(doc(db, `sessions`, session))
                    .then((d) => {                
                        const date = new Date((d.data().sessionStarted.seconds * 1000)).toLocaleDateString();
                        if (!sessionID.has(session)) {
                            setSessionID(prevSessions => new Map(prevSessions).set(session, date));
                        }
                    }).catch(error => {
                        console.error('Error sending request: ', error);
                    });
                };
            }));
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    React.useEffect(() => {
        fetchSessionsWithVideos(); // Fetch videos for the session when component mounts
    }, []);

    return (
        <View className="w-full h-full flex flex-col items-center bg-brand-colordark-green">
            <Stack.Screen options={{headerShown:false}}></Stack.Screen>
            <View className="h-[30%] w-full items-center justify-center mb-4">
                <BackButton className="h-[5%]" action={() => router.back()} />
                <View className="flex-row justify-end items-center mb-10 absolute left-[10%] top-[80%]">
                    <View className="flex-row mb-2">
                        <Text className="font-semibold text-3xl text-stone-50">Videos per session</Text>
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.wrapper} className="h-[60%] w-full flex flex-col rounded-t-3xl px-[4%] bg-stone-100 pt-5"
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                <View style={styles.container} className="h-full my-2 py-2">
                    {Array.from(sessionID).map(([id, started]) => (
                        <View key={id} 
                            className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-5 mx-3">
                            <Text className="text-base text-brand-colordark-green font-semibold">Session on {started}</Text>
                            <Text className="text-base text-brand-colordark-green font-light mb-1">{id}</Text>
                            
                            <Link href={{
                                pathname: "/home/playback",
                                params: { session: id },
                            }}>
                                <Text className="text-brand-colordark-green font-semibold">View videos</Text>
                            </Link>

                            {sessionID.length === 0 && <Text>No videos for this session</Text>}
                        </View>
                    ))}
                    {sessionID.size === 0 && <Text>No videos found</Text>}
                </View>
            </ScrollView>
        </View>
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

