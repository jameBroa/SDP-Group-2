{/* 
    Back-button component to replace the one in the header.
*/}

import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

const BackButton = ({ href=null, action=null }) => {
    if (href == null) {
        return (
            <Pressable onPress={action} style={ styles.button } >
                <Text style={ styles.text }>&lt;</Text>
            </Pressable>
        );
    }

    return (
        <Link href={href} style={ styles.button } >
            <Text style={ styles.text }>  &lt;</Text>
        </Link>
    );
};

const styles = StyleSheet.create({
    button:{
      width:42,
      height:42,
      backgroundColor:'white',
      alignItems:'center',
      justifyContent:'center',
      overflow:'hidden',
      borderRadius:20,
      position:'absolute',
      left:40,
      top:50
    },
    text:{
      fontSize:32,
      color:'black',
      lineHeight:42,
    }
});

export default BackButton;
