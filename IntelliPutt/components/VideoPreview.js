import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
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
    borderRadius: 10,
  },
});

export default VideoPreview;