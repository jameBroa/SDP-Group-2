import React from 'react'
import DefaultContainer from '../../components/DefaultContainer'
import { Text, View } from 'react-native'

export default function social() {
  return (
    <View className="w-full h-full flex flex-col">
        <View className="h-[30%]  ">
            <DefaultContainer subheading="Let's view your" heading="Friends!"/>
        </View>
        <View className="h-[70%] w-full flex flex-row justify-center items-center">
            <Text className="text-2xl ">🚧This area is to be completed🚧</Text>
        </View>
    </View>
  )
}