import { Feather, Ionicons } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'
import COLOURS from '../../static/design_constants'
import { LinearGradient } from 'expo-linear-gradient'
import DefaultContainer from '../../components/DefaultContainer'

const stats = () => {
  return (
    <View className="w-full h-full flex flex-col">
        <View className="h-[30%] ">
            <DefaultContainer subheading="Let's view your" heading="Statistics!"/>
        </View>
        <View className=" h-[70%] w-full flex flex-row justify-center items-center bg-slate-300">
            <Text className="text-2xl ">🚧This area is to be completed🚧</Text>

        </View>

    </View>
  )
}

export default stats