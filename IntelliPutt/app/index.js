{/* 
    INDEX PAGE
    This is the first page that the user sees when they open the app.

    Links to
      - Login page
      - Register page
*/}

import { SafeAreaView, ImageBackground, Image, Text, View } from 'react-native';
import React from 'react';
import CustomButton from '../components/CustomButton';
import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';

export default function Index() {
  const user = useSelector((state) => state.user.user);

  if (!user) { 
    return (
      <View className="bg-white flex flex-row justify-center w-full" >
        <Stack.Screen options={{headerTitle:'index', headerShown:false}}> </Stack.Screen>

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
            
            <View className="inline-flex flex-col items-center justify-center h-1/3 w-2/3">
              <CustomButton text="Login" goTo="./login" />
              <CustomButton text="Create an account" goTo="./register" />
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }
};
