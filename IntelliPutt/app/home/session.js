import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import BackButton from '../../components/BackButton'
import { Stack, router } from 'expo-router'

export default function Session() {

  const [success, setSuccess] = useState(false);

  async function connectToAPI(){
    const url = "https://httpbin.org/get" //TEST URL FOR NOW

    try{
      const response = await fetch(url);
      if(response.status === 200){
        const result = await response.json(); //replace with appropriate code
        // fill in rest of code
        console.log("api success")
        console.log(result)
        setSuccess(true);
      }

    } catch {
      console.log(error)
      setSuccess(false);
    }
  }

  return (
    <View className="flex-1 bg-stone-50">
            <Stack.Screen options={{headerShown:false}}></Stack.Screen>
            <View className="bg-[#283C0A] pt-10 px-5 border-lime-700 h-[25%]">
                <BackButton className="h-[5%]" action={() => router.back()} />
                <View className="flex-row justify-end items-center mb-10 absolute left-[10%] top-[80%]">
                    <View className="flex-row ">
                        <Text className="font-semibold text-4xl text-stone-50">New Session</Text>
                    </View>
                </View>
            </View>
            <View className="w-full h-[80%] flex flex-col justify-center items-center">
              <Pressable onPress={connectToAPI()} className="w-32 h-12 bg-brand-colordark-green rounded-xl flex flex-row justify-center items-center">
                <Text className="text-white text-2xl font-light">Start now</Text>
              </Pressable>
              {!success && (
                <Text>Unsuccessful connection</Text>
              )}
              {success &&(
                <Text>Successful connection</Text>
              )}
            </View>
      </View>
  )
}

