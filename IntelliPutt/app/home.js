{/* 
    HOME PAGE
    User is directed here after logging in.

    (needs to be implemented)
*/}

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home Page!</Text>
            {/* Add your content here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default Home;
