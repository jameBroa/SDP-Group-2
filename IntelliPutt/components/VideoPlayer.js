import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const VideoPlayer = ({ url }) => {  
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
            uri: url,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        <View style={styles.buttons}>
        {/* <Button
            title={status.isPlaying ? 'Pause' : 'Play'}
            onPress={() =>
            status.isPlaying ? video.current.playAsync() : video.current.playAsync()
            }
        /> */}
      </View>
    </View>
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
    width: 300,
    height: 170,
    marginBottom: 30,
    cornerRadius: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPlayer;