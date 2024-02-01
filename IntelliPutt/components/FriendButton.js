import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import COLOURS from '../static/design_constants'

const FriendButton = () => {
    const styles = StyleSheet.create({
        customGold: {
            backgroundColor: COLOURS.MEDIUM_GOLD
        },
        customGreen: {
            backgroundColor: COLOURS.DARK_GREEN
        }
    });
  return (
    <View style={styles.customGreen} className="rounded-xl w-28 h-16 flex flex-row items-center">
        <View className="flex flex-row justify-start">
            {/* AVATAR STUFF */}
            <View className="flex flex-col justify-center ">
                <View className="w-8 h-8 rounded-full bg-slate-400"/>
            </View>
            {/* NAME AND SKILL */}
            <View className="h-[100%] flex flex-col justify-evenly">
                <Text  className="text-white">Joe</Text>
                <Text className="text-white">Advanced</Text>
            </View>
            {/* ONLINE STATUS */}
            <View className="h-[100%] flex flex-col justify-center " >
                <View className="w-1 h-auto" style={styles.customGold}><Text> </Text></View>
            </View>
        </View>
    </View>
  )
  


}

export default FriendButton