{/* 
    HOME PAGE
    User is directed here after logging in.

    (needs to be implemented)
*/}

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// import Footer from '../components/Footer';
import {LinearGradient} from 'expo-linear-gradient';
// import FriendButton from '../components/FriendButton';
// import StatsButton from '../components/StatsButton';
// import GuidesButton from '../components/GuidesButton';
import StatsGraphic1 from '../../static/images/test-image-2.png'
import StatsGraphic2 from '../../static/images/test-image-3.png';
import StatsGraphic3 from '../../static/images/test-image-4.png';
import { Redirect, Stack } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import FriendButton from '../../components/FriendButton';
import StatsButton from '../../components/StatsButton';
import GuidesButton from '../../components/GuidesButton';
import COLOURS from '../../static/design_constants';
import DefaultContainer from '../../components/DefaultContainer';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';


export default function Index() {
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        // Check if user is logged in
        // If not, redirect to login page
        if (!user) {
            router.push('../login');
        }
    }, [user]);
    
    if (user) {
        return (
            <View className="h-full w-full flex flex-col ">
                
                <View className="h-[30%]">
                    <DefaultContainer subheading="Welcome back!" heading={user["name"]}/>
                </View>
                
                
                <View className="w-full justify-between flex flex-col space-y-1 ">
                    <Text className="text-xl text-gray-400 pl-3">Your Friends</Text>
                    <View className=" w-full flex flex-row justify-around  ">
                        {/* TODO: Wrap in Pressables */}
                        <FriendButton name={"Joe"} skill={"Advanced"} online/>
                        <FriendButton name={"Adam"} skill={"Beginner"} online/>
                        <FriendButton offline/>

                    </View>
                    <Text className="text-xl text-gray-400 pl-3">Your Stats</Text>
                    <View className=" w-full flex flex-row justify-around ">
                        {/* TODO: Wrap in Pressables */}
                        <StatsButton day={"Monday"} numToReview={"12"} imgSrc={StatsGraphic1}/>
                        <StatsButton day={"Tuesday"} numToReview={"5"} imgSrc={StatsGraphic2}/>
                        <StatsButton day={"View More"} view imgSrc={StatsGraphic3}/>
                    </View>
                    <Text className="text-xl text-gray-400 pl-3">Recommended Guides</Text> 
                    <View className=" w-full flex flex-row justify-around ">
                        {/* TODO: Wrap in Pressables */}
                        <GuidesButton title={"Putting Tutorial"}/>
                        <GuidesButton title={"Control Tips"}/>
                        <GuidesButton title={"View more Guides"}/>
                    </View>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});
