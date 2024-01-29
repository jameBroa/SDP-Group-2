{/* 
    Back-button component to replace the one in the header.
*/}

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const BackButton = ({ href }) => {
    return (
        <Link href={href} style={ styles.button } >
            <Text style={ styles.text }>  &lt;</Text>
        </Link>
    );
};

const styles = StyleSheet.create({
    button:{
      width:45,
      height:45,
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
