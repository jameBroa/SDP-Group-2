{/* 
    HOME PAGE
    User is directed here after logging in.

    (needs to be implemented)
*/}

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Header from '../components/Header';
import BentoBoxes from '../components/BentoBoxes';
import Footer from '../components/Footer';
import {LinearGradient} from 'expo-linear-gradient';
import FriendButton from '../components/FriendButton';
import StatsButton from '../components/StatsButton';
import GuidesButton from '../components/GuidesButton';
import StatsGraphic1 from '../static/images/test-image-2.png';
import StatsGraphic2 from '../static/images/test-image-3.png';
import StatsGraphic3 from '../static/images/test-image-4.png';



const Home = () => {
    return (
        <View className="h-full">
            <LinearGradient className="h-[30%]"
            colors={['rgba(25,46,5,1)',  'rgba(105,190,25,0)']}
            start={[0, 0.1]}
            end={[0, 1]}
            >
                <View className="top-[22%]">
                    <Header className=""/>
                    <View className="flex flex-col space-y-2 pl-4 top-14">
                        <Text className="text-3xl text-white ">Welcome back</Text>
                        <Text className="text-4xl text-white font-bold">Joseph</Text>
                    </View>
                    <View className="absolute flex flex-row w-full justify-center top-[45%]">
                        <Image
                            style={{ width: 400, height: 150 }}
                            source={require('../static/images/golf-graphic.png')}
                            />
                    </View>
                </View>
            </LinearGradient>
            <View className="w-full h-[70%]  justify-between flex flex-col space-y-1">
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
                <Text className="text-xl text-gray-400 pl-3">Reccommended Guides</Text> 
                <View className=" w-full flex flex-row justify-around ">
                    {/* TODO: Wrap in Pressables */}
                    <GuidesButton title={"Putting Tutorial"}/>
                    <GuidesButton title={"Control Tips"}/>
                    <GuidesButton title={"View more Guides"}/>
                </View>
                {/* Footer */}
                <View className="w-full flex flex-col h-[15%] bg-slate-400 justify-start">
                    <Footer/>
                </View>

            </View>
        </View>
    );
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

export default Home;
