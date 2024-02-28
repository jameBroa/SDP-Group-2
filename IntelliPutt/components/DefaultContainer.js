import { LinearGradient } from 'expo-linear-gradient'
import { Link, Redirect, Stack, router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Button, Image, Pressable, Text, View } from 'react-native'
import COLOURS from '../static/design_constants'
import { Ionicons } from '@expo/vector-icons'
import {session} from '../app/home/session'
import { AntDesign } from '@expo/vector-icons';
const DefaultContainer = ({subheading, heading, number, session=false}) => {
    return (
    <View className="h-[100%] w-full flex flex-col justify-start">
        <Stack.Screen 
            options={{
                headerTitle:'',
                headerStyle: {
                    backgroundColor: "#rgba(40, 60, 10, 1)",
                    borderBottomWidth: 0
                }, 
            headerShadowVisible: false,
            headerRight: () => <Pressable onPress = {() => router.push("/home/notifications")} className="w-[45%] flex flex-row justify-center ">
                        <Ionicons name="notifications-outline" size={32} color="white"/>
                        <View className="h-4 w-4 rounded-full absolute right-6 bg-red-600 flex flex-row justify-center">
                            <Text className="text-white">{number}</Text>
                        </View>

                </Pressable>,
            headerShown:true}}>
        </Stack.Screen>
        <LinearGradient className="h-[100%] flex flex-col justify-start z-0"
            colors={['rgba(40, 60, 10, 1)',  'rgba(105, 190, 25, 0.1)']}
            start={[0, 0]}
            end={[0, 2.5]}>
            {/* need to adjust this var if position not there */}
            <View style={{top:session ? '12%':'18%' }}> 
                <View className="flex flex-col space-y-2 pl-4 top-8 z-50">
                    <Text className="text-3xl text-white ">{subheading}</Text>
                    <Text className="text-4xl text-white font-bold">{heading}</Text>
                    {session && (
                        // <Link href="../app/home/session">
                            <Pressable onPress={() => {router.push("/home/session")}} className="z-50 w-32 h-10 rounded-full bg-brand-colordark-green">
                                <View className="w-[100%] h-[100%] flex flex-row justify-center items-center"> 
                                    <AntDesign name="plus" size={16} color="white" />
                                    <Text className="text-stone-200 text-sm">Start session</Text>
                                </View>
                            </Pressable>
                        // </Link>
                    )} 
                </View>
                <View className="absolute flex flex-row w-full justify-center top-[25%] z-0">
                    <Image
                        style={{ width: 400, height: 150 }}
                        source={require('../static/images/golf-graphic.png')}
                    />
                </View>
            </View>
        </LinearGradient>
    </View>
  )
}

export default DefaultContainer