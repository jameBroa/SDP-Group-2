import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import COLOURS from '../static/design_constants'

const FriendButton = ({friend, online, offline}) => {
    const styles = StyleSheet.create({
        customGold: {
            backgroundColor: COLOURS.MEDIUM_GOLD
        },
        customGreen: {
            backgroundColor: COLOURS.BRAND_COLORDARK_GREEN
        },
        customGrayedGreen: {
            backgroundColor: COLOURS.GRAYED_GREEN
        },
    });
  return (
    <View style={styles.customGreen} className="rounded-xl w-[33%] h-16 flex flex-row justify-between pl-1 pr-1 items-center mx-1">
            {/* AVATAR STUFF */}
            <View className="flex flex-col justify-center ">
            <Image source={require('../static/images/user_placeholder.jpeg')} className="ml-1 rounded-full w-10 h-10" />
            </View>
            {/* NAME AND SKILL */}
            <View className="h-[100%] flex flex-col justify-center space-y-0.5">
                <Text  className="text-white text-sm font-medium flex-wrap">{friend.name}</Text>
                <Text className="text-white text-xs font-light">{friend.skill}</Text>
            </View>
            {/* ONLINE STATUS */}
            <View className="h-[100%] flex flex-col justify-center" >
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