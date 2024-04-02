import * as React from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import { getStorage, ref, listAll } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useReduxStateUpdater } from '../../context/util/updateState';
import { Link, Stack, router } from 'expo-router';
import BackButton from '../../components/BackButton';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../config/database';

export default function VideosPerSession() {
    const user = useSelector((state) => state.user.user);
    const [sessionID, setSessionID] = React.useState(new Map());
    const [refreshing, setRefreshing] = React.useState(false);

    const { fetchSessions, fetchVideos } = useReduxStateUpdater();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchVideos();
        getSessionsWithVideos();
        setTimeout(() => setRefreshing(false), 1000);
    }, [])

    const getSessionsWithVideos = async () => {
        console.log("Fetching sessions...");

        try {
            const storage = getStorage();
            
            // Iterate over each session
            try {
                let videoMap = new Map(user.videos);
    
                videoMap.forEach (function(value, key) {
                    if (value.length > 0) {
                        getDoc(doc(db, `sessions`, key))
                        .then((d) => {                
                            const date = d.data().sessionStarted.seconds * 1000;
                            if (!sessionID.has(key)) {
                                setSessionID(prevSessions => new Map(prevSessions).set(key, date));
                            }
                        }).catch(error => {
                            console.error('Error sending request: ', error);
                        });
                    }
                })
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    React.useEffect(() => {
        fetchSessions();
        console.log("Getting sessions with videos");
        getSessionsWithVideos(); // Fetch videos for the session when component mounts
    }, []);

    return (
        <View className="w-full h-full flex flex-col items-center bg-brand-colordark-green">
            <Stack.Screen options={{headerShown:false}}></Stack.Screen>
            <View className="h-[30%] w-full items-center justify-center mb-4">
                <BackButton className="h-[5%]" action={() => router.replace("/home/profile")} />
                <View className="flex-row justify-end items-center mb-10 absolute left-[10%] top-[80%]">
                    <View className="flex-row mb-2">
                        <Text className="font-semibold text-3xl text-stone-50">Watch your videos</Text>
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.wrapper} className="h-[60%] w-full flex flex-col rounded-t-3xl px-[4%] bg-stone-100 pt-5"
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                <View style={styles.container} className="h-full my-2 py-2">
                    <View
                        className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-4 mx-3 mb-3">
                        
                        <Link href={{
                            pathname: "/home/playbackAllTime",
                        }}>
                            <Text className="text-base text-brand-colordark-green font-semibold">View all</Text>
                        </Link>
                    </View>

                    
                    <Text className="text-lg text-gray-400 pl-4 pt-3 font-medium mt-1 mb-2">Per session</Text>
                    {Array
                    .from(sessionID.entries())
                    .sort((a, b) => new Date(b[1]) - new Date(a[1]))
                    .map(([id, started]) => (
                        <View key={id} 
                            className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-5 mx-3 mb-3">
                            <Text className="text-base text-brand-colordark-green font-semibold">Session on {new Date(started).toLocaleString()}</Text>
                            <Text className="text-base text-brand-colordark-green font-light mb-1">{id}</Text>
                            
                            <Link href={{
                                pathname: "/home/playbackBySession",
                                params: { session: id, date: new Date(started).toLocaleString() },
                            }}>
                                <Text className="text-brand-colordark-green font-semibold">View videos</Text>
                            </Link>
                        </View>
                    ))}
                    {sessionID.size === 0 && 
                    <View 
                    className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-5 mx-3">
                        <Text>No sessions with videos found</Text>
                    </View>
                    }
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

