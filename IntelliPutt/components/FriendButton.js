import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import COLOURS from '../static/design_constants'

const FriendButton = ({name, skill, online, offline}) => {
    const styles = StyleSheet.create({
        customGold: {
            backgroundColor: COLOURS.MEDIUM_GOLD
        },
        customGreen: {
            backgroundColor: COLOURS.DARK_GREEN
        },
        customGrayedGreen: {
            backgroundColor: COLOURS.GRAYED_GREEN
        },
    });
  return (
    <View style={styles.customGreen} className="rounded-xl w-28 h-16 flex flex-row justify-between pl-1 pr-1 items-center">
        
            {/* AVATAR STUFF */}
            <View className="flex flex-col justify-center ">
                <View className="w-8 h-8 rounded-full bg-slate-400"/>
            </View>
            {/* NAME AND SKILL */}
            <View className="h-[100%] flex flex-col justify-center space-y-2">
                <Text  className="text-white text-xs">{name}</Text>
                <Text className="text-white text-xs">{skill}</Text>
            </View>
            {/* ONLINE STATUS */}
            <View className="h-[100%] flex flex-col justify-center " >
                {online && (
                <View className="w-1 h-[70%] rounded-xl" style={styles.customGold}>
                    <Text></Text>
                </View>
                )}
                {offline && (
                    <View className="w-1 h-[70%] rounded-xl" style={styles.customGrayedGreen}>
                        <Text></Text>
                    </View>
                )}
            </View>
        
    </View>
  )
  


}

export default FriendButton