import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import COLOURS from '../static/design_constants'

const GuidesButton = ({title}) => {
    const styles = StyleSheet.create({
        customGold: {
            backgroundColor: COLOURS.MEDIUM_GOLD
        },
        textGold: {
            color: COLOURS.MEDIUM_GOLD
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
                source={require('../static/images/test-image-2.png')}
                className="rounded-xl"
                />
            </View>
            <View className="ml-1 flex flex-col justify-around pl-1 h-[60%] ">
                <Text className="text-white text-lg font-semibold flex-wrap max-w-[85%]">{title} </Text>
                <Text className="text-white font-light text-xs" >View more -{'>'}</Text>
            </View>
        </View>
    </View>
  )
}

export default GuidesButton