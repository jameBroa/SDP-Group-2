import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { View, Dimensions, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';

export default function Playback() {
    const user = useSelector((state) => state.user.user);
    const { session, date } = useLocalSearchParams();
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
        const storage = getStorage();
        const sessionRef = ref(storage, `videos/${user.uid}/${session}`);
        const items = await listAll(sessionRef); // List all items (videos) in the session directory
        
        console.log("Session " + session + "has " + items);
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

    useEffect(() => {
      setVideos([]);
      setCurrentViewableItemIndex(0);
      fetchVideos();
    }, [session]);
    
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
                title: `${currentViewableItemIndex + 1} of ${videos.length} from ${date.slice(0, 5)}`,
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