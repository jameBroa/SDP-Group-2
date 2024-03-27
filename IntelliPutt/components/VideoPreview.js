import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const VideoPreview = ({ url }) => {  
    const video = React.useRef(null);
    return (
        <Video
          className="mx-1"
          ref={video}
          style={styles.video}
          source={{
              uri: url,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
        />
    );
}

const styles = StyleSheet.create({
  video: {
    alignSelf: 'left',
    width: 160,
    height: 100,
  },
});

export default VideoPreview;