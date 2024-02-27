import React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import COLOURS from '../static/design_constants'
import { MaterialIcons } from '@expo/vector-icons';

const FriendCard = ({ friend }) => {
    return (
        <View className="items-center flex-row py-3 my-1 mx-2 w-full rounded-xl" style={styles.customGreen}>
            <View className="px-5">
                <Image source={require('../static/images/user_placeholder.jpeg')} className="rounded-full w-16 h-16" />
            </View>
            <View className="flex items-center">    
                <View className="">
                    <Text className="text-base font-semibold text-stone-50">{friend.name} | {friend.username} </Text>
                    <Text className="text-sm text-stone-200 py-1 font-light">
                        {friend.email}
                    </Text>
                    <View className="flex-row py-1"> 
                        <Text className="text-stone-100 font-regular text-left pr-6">{friend.skill}</Text>
                        <Ionicons name="golf" size={16} color={COLOURS.MEDIUM_GOLD} />
                        <Text className="text-stone-100 font-medium text-left pl-[7px] pr-4 pt-[1px]">67% </Text>
                        <MaterialIcons name="local-fire-department" size={18} color="#ff724f" />
                        <Text className="text-stone-100 font-medium text-left pl-[5px] pt-[1px]">2 days</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

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
    customRed: {
        backgroundColor: COLOURS.FLAG_RED
    }
});

export default FriendCard