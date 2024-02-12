import React from 'react'
import DefaultContainer from '../../components/DefaultContainer'
import { Text, View } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { useDispatch } from 'react-redux';
import { logout } from '../../context/slices/userSlice';
import { Link, Redirect } from 'expo-router';
import { LineGraph } from 'react-native-graph';

export default function Profile() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log('Logging out');
    dispatch(logout());
  }


  return (
    <View className="w-full h-full flex flex-col">
        <View className="h-[30%]  ">
            <DefaultContainer subheading="Let's view your" heading="Profile!"/>
        </View>
        <View className="h-[70%] w-full flex flex-col justify-center">
            <Text className="text-2xl ">🚧This area is to be completed🚧</Text>
            <CustomButton text="Logout" onPress={handleLogout} />
            
        </View>
    </View>
  )
}

