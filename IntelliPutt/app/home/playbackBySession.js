import { getStorage, ref, deleteObject } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { View, Dimensions, FlatList, StyleSheet, Pressable, Text, Alert } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import { useReduxStateUpdater } from '../../context/util/updateState';

export default function Playback() {
    const user = useSelector((state) => state.user.user);
    const { session, date } = useLocalSearchParams();
    const [videos, setVideos] = React.useState([]);
    
    const { fetchVideosPerSession } = useReduxStateUpdater();

    const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
        }
    }
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])
    
    const getVideos = async () => {
      try {
          fetchVideosPerSession(session);

          let videosMap = new Map(user.videos);

          setVideos(videosMap.get(session));
      } catch (error) {
          console.error('Error fetching videos:', error);
      }
    };

    const deleteVideo = () => {
      const storage = getStorage();

      const regex = /F(\d+)\.mp4/;

      const match = videos[currentViewableItemIndex].match(regex);
        if (match) {
          const videoNum = match[1];
          console.log(videoNum);

          // Create a reference to the file to delete
          const desertRef = ref(storage, 'videos/' + user.uid + '/' + session + '/' + videoNum + '.mp4');

          // Delete the file
          deleteObject(desertRef).then(() => {
            alert("Video deleted successfully");
            
            // Remove video from videos array
            setVideos(prevVideos => prevVideos.filter(video => video !== videos[currentViewableItemIndex]));
          }).catch((error) => {
            alert("Error deleting video: " + error);
          });
        }
    }

    const downloadVideo =  () => {
    }

    const videoOptions = () => {
      Alert.alert('Video options', "", [
        {
          text: "SessionID: " + session,
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Download video',
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete video',
          onPress: () => deleteVideo(),
          style: 'destructive',
        }
      ]);
    }

    useEffect(() => {
      setVideos([]);
      setCurrentViewableItemIndex(0);
      getVideos();
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
                    <Text className="pl-5 text-base font-medium text-stone-700">Back</Text>
                </Pressable>,
                headerRight: () => <Pressable onPress={videoOptions} className="pr-5 mb-1">
                    <Fontisto name="more-v-a" size={22} color="black" />
                </Pressable>,
                title: `${currentViewableItemIndex + 1} of ${videos.length} from ${date}`,
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
      try {
        if (!video.current) return;
    
        if (shouldPlay) {
          video.current.playAsync();
        } else {
          video.current.pauseAsync();
          video.current.setPositionAsync(0);
        }
      } catch (error) {
        console.error('Error playing video:', error);
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