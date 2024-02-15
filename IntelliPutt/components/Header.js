import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import COLOURS from '../static/design_constants';

const Header = () => {
    const openMenu = (e) => {
        console.log("Menu open");
    }
    return (
    <View className="w-full flex flex-row justify-between">
            <View className=" w-[20%] flex flex-row justify-end">
                <Pressable onPress={openMenu}>
                    <Feather name="menu" size={32} color='white' />
                </Pressable>    
            </View>
            <View className=" w-[20%] flex flex-row justify-start">
                <Ionicons name="notifications-outline" size={32} color='white' />
            </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'normal',
        marginBottom: 16,
        color: 'white'
    },
});

export default Header