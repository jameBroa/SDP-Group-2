import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import COLOURS from '../static/design_constants'


const StatsButton = ({day, view, numToReview, imgSrc}) => {
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
    <View style={styles.customGreen} className="rounded-xl w-28 h-40 flex flex-row"> 
        <View className="flex flex-col justify-start">
            {/* Image */}
            <View className="w-28 h-[40%] bg-lime-50 rounded-xl">
                <Image
                style={styles.img}
                // source={require('../static/images/test-image-2.png')}
                source={imgSrc}
                className="rounded-xl"
                />
            </View>
            <View className="ml-1 flex flex-col justify-around pl-1 h-[60%] ">
                <Text className="text-white text-lg font-semibold">{day}</Text>
                {!view && (
                <Text className="font-medium text-white text-xs">{numToReview} Putts to review</Text>
                )}
                {view && (
                    <Text className="text-white text-xs">View all your Putts</Text>
                )}
                <Text className="mb-1 text-white text-xs font-light">View more -{'>'}</Text>
            </View>
        </View>
    </View>
  )
}

export default StatsButton