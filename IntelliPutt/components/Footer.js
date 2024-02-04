import React from 'react'
import {View, Text, StyleSheet, Pressable} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import COLOURS from '../static/design_constants';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {Link} from 'expo-router'
const Footer = ({home, stats, profile, settings}) => {
  const styles = StyleSheet.create({
    customGold: {
        backgroundColor: COLOURS.MEDIUM_GOLD
    },
    customGreen: {
        backgroundColor: COLOURS.DARK_GREEN
    },
    img: {
        alignSelf:'center',
        height: 64,
        width:112
    }
});
  return (
    <View style={styles.customGreen} className="w-full h-[100%] flex flex-row  justify-evenly items-center">
            <View className=" flex flex-col space-y-1 justify-center items-center w-1/5 rounded-xl ">
              <Link href="./home">
                <View className="flex flex-col">
                <AntDesign name="home" size={36} color={home ? "white" : COLOURS.GRAYED_GREEN} />
                <Text className="text-white text-sm">Home</Text>
                </View>
              </Link>
            </View>
            <View className=" flex flex-col space-y-1 justify-center items-center w-1/5 rounded-xl ">
            <Link href="./stats">
            <View className="flex flex-col">
              <Entypo name="line-graph" size={36} color={stats ? "white" : COLOURS.GRAYED_GREEN} />              
              <Text className="text-white text-sm">Stats</Text>
              </View>
              </Link>
            </View>
            <View className=" flex flex-col space-y-1 justify-center items-center w-1/5 rounded-xl ">
              <AntDesign name="user" size={36} color={COLOURS.GRAYED_GREEN} />
              <Text className="text-white text-sm">Profile</Text>
            </View>
            <View className=" flex flex-col space-y-1 justify-center items-center w-1/5 rounded-xl ">
                <Ionicons name="settings-outline" size={32} color={COLOURS.GRAYED_GREEN} />
                <Text className="text-white text-sm">Settings</Text>
            </View>
    </View>
  )
}

export default Footer