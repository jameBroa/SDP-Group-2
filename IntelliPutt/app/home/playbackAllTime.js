import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { getDoc, doc } from 'firebase/firestore';
import db from '../../config/database';
import { useSelector } from 'react-redux';
import { Stack, router } from 'expo-router';
import { View, Dimensions, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';

export default function Playback() {
    const user = useSelector((state) => state.user.user);
    const [allVideos, setAllVideos] = React.useState([]);
    const [videos, setVideos] = React.useState([{}]);

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
        const storage = getStorage();
        
        // Iterate over each session       
        await Promise.all(user.sessions.map(async (session) => {
            const sessionRef = ref(storage, `videos/${user.uid}/${session}`);
            const items = await listAll(sessionRef); // List all items (videos) in the session directory
            
            // If there are videos in the session, add the session to the state
            if (items.items.length > 0) {
                getDoc(doc(db, `sessions`, session))
                .then((d) => {                
                    let currentVideoURLs = []
                    const date = new Date((d.data().sessionStarted.seconds * 1000)).toLocaleDateString();
                    
                    // If the session is not already in the state, add it
                    if (!videos.some(e => e.session === session)) {
                        // Iterate over each video in the session
                        Promise.all(items.items.map(async (item) => {
                            const url = await getDownloadURL(item); // Get download URL for each video
                            // If the URL is not already in the state, add it
                            if (currentVideoURLs.includes(url) == false) {
                                currentVideoURLs.push(url);
                            }
                        }));

                        setVideos(prevVideos => [...prevVideos, {
                            key: prevVideos.length + 1,
                            session: session,
                            date: date,
                            videoURLs: currentVideoURLs,
                        }]); // Push URL to videoURLs array
                    }
                }).catch(error => {
                    console.error('Error sending request: ', error);
                });
            };
        }));
        // Put all videos in one list
        setAllVideos(videos.map((video) => video.videoURLs).flat());
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
                title: `${currentViewableItemIndex + 1} of ${allVideos.length}`,
                headerTintColor: '#000000',
                headerTitleStyle: {
                    fontSize: 18,
                },
                headerBackTitleVisible: true,
            }
            } 
            />
            <FlatList
                data={allVideos}
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
