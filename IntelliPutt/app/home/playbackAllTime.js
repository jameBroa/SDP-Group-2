import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { getDoc, doc } from 'firebase/firestore';
import db from '../../config/database';
import { useSelector } from 'react-redux';
import { Stack, router } from 'expo-router';
import { View, Dimensions, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import ReduxStateUpdater from '../../context/util/updateState';

const Playback = () => {
    const user = useSelector((state) => state.user.user);
    const [videos, setVideos] = React.useState([]);

    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])
    
    const fetchVideos = async () => {
      try {
        ReduxStateUpdater.fetchSessions(user);
        const storage = getStorage();
        
        // For each session
        let currentVideoURLs = []       
        await Promise.all(user.sessions.map(async (session) => {
            const sessionRef = ref(storage, `videos/${user.uid}/${session}`);

            // List all items (videos) in the session directory
            const items = await listAll(sessionRef); 
            
            // If there are videos in the session
            if (items.items.length > 0) {
                await getDoc(doc(db, `sessions`, session))
                .then(async (d) => {                
                    
                    // For each video in the session
                    await Promise.all(items.items.map(async (item) => {

                        const url = await getDownloadURL(item);

                        // If the URL is not already in the state, add it
                        if (!videos.includes(url) && !currentVideoURLs.includes(url)) {
                            currentVideoURLs.push(url);
                        }
                    }));
                }).catch(error => {
                    console.error('Error sending request: ', error);
                });
            };
        }));
        console.log("Current video URLs: " + currentVideoURLs);
        setVideos(prevVideos => [...prevVideos, currentVideoURLs]); // Push URL to videos array
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
    };

    useEffect(() => {
      fetchVideos(); // Fetch videos for the session when component mounts
    }, []);

    return (
        <View className="w-full h-full flex flex-col items-center bg-[]" style={styles.videoContainer}>
            <Stack.Screen options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#e7e5e4',
                },
                headerBackButtonMenuEnabled: true,
                headerLeft: () => <Pressable onPress={() => router.replace("/home/videos")} >
                    <Text className="pl-5 text-base">Back</Text>
                </Pressable>,
                title: `${currentViewableItemIndex + 1} of ${videos.length}`,
                headerTintColor: '#000000',
                headerTitleStyle: {
                    fontSize: 18,
                },
                headerBackTitleVisible: true,
            }
            } 
            />
            <FlatList
                data={videos}
                renderItem={({ item, index }) => (
                    <Item item={item} shouldPlay={index === currentViewableItemIndex} />
                )}
                keyExtractor={item => item}
                pagingEnabled
                horizontal={false}
                showsVerticalScrollIndicator={false}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            />
        </View>
    );
}

const Item = ({ item, shouldPlay }) => {
    const video = React.useRef(null);
    const [status, setStatus] = useState(null);
  
    useEffect(() => {
      if (!video.current) return;
  
      if (shouldPlay) {
        video.current.playAsync()
      } else {
        video.current.pauseAsync()
        video.current.setPositionAsync(0)
      }
    }, [shouldPlay])
  
    return (
      <Pressable onPress={() => status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()}>
        <View style={styles.videoContainer}>
        <Video 
          ref={video}
          source={{ uri: item }}
          style={styles.video}
          isLooping
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </View>
      </Pressable>
    );
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    videoContainer: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - 100, // Keep aspect ratio 16:9
      justifyContent: 'center',
    },
    video: {
        alignSelf: 'center',
        width: "100%",
        aspectRatio: 16 / 9, // Keep aspect ratio 16:9
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        paddingTop: 50,
        paddingBottom: 30
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

export default Playback;