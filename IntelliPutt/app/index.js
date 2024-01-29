import { Link, Stack, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ImageBackground, Image, Text, View } from 'react-native';
import React from 'react';
import "../static/styles/index.css";

export default function Home() {
  return (
    <View className="bg-white flex flex-row justify-center w-full" >
      <View className="bg-white w-full h-screen">
        <ImageBackground
          resizeMode="cover"
          source={require('../static/images/background.png')}
          className="justify-center flex-1">
          <SafeAreaView className="flex flex-col items-center justify-center h-full">

            <View className="flex flex-col items-center justify-center gap-[50px] h-1/2">
              <Image
                style={{ width: 150, height: 150 }}
                source={require('../static/images/logo_transparent.png')}
                className="relative w-[150px] h-[150px] object-cover"
              />
              <Text className="[font-family:'Poppins-ExtraBold',Helvetica] font-normal text-stone-200 text-[50px] text-center tracking-[0] leading-[normal]">
                <Text className="font-extrabold">Intelli</Text>
                <Text className="[font-family:'Poppins-Medium',Helvetica] font-medium">Putt</Text>
              </Text>
            </View>
            
            <View className="inline-flex flex-col items-center justify-center h-1/3 w-2/3 gap-[10px]">
              <Link href="./login" asChild>
                <Pressable className="bg-stone-200 rounded-xl border-2 border-stone-200 py-3 px-6 font-bold m-2 min-w-full"> 
                  <Text className="[font-family:'Poppins-Medium',Helvetica] text-base text-stone-600 text-center font-medium">Login</Text>
                </Pressable>
              </Link>
              <Link href="./register" asChild>
                <Pressable className="bg-stone-200 rounded-xl border-2 border-stone-200 py-3 px-6 font-boldm-2 mx-2 min-w-full"> 
                  <Text className="[font-family:'Poppins-Medium',Helvetica] text-base text-stone-600 text-center font-medium">Create an account</Text>
                </Pressable>
              </Link>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    </View>
  );
};
