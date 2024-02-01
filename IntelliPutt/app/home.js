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
                <Text className="text-xl text-gray-400 pl-4">Your Friends</Text>
                <View className=" w-full flex flex-row justify-around ">
                    {/* TODO: Wrap in Pressables */}
                    <FriendButton/>
                    <FriendButton/>
                    <FriendButton/>
                </View>
                <Text className="text-xl text-gray-400 pl-4">Your Stats</Text>
                <View className=" w-full flex flex-row justify-around ">
                    {/* TODO: Wrap in Pressables */}
                    <StatsButton day={"Monday"} />
                    <StatsButton day={"Tuesday"} />
                    <StatsButton day={"View More"} view/>
                </View>
                <Text className="text-xl text-gray-400 pl-4">Reccommended Guides</Text> 
                <View className=" w-full flex flex-row justify-around ">
                    {/* TODO: Wrap in Pressables */}
                    <GuidesButton/>
                    <GuidesButton/>
                    <GuidesButton/>
                </View>
                {/* Footer */}
                <View className="w-full flex flex-col h-[15%] bg-slate-400 justify-start">
                    <Footer/>
                </View>

            </View>
        </View>
        // <View style={styles.container}>
        //     <Header
        //     ViewComponent={LinearGradient} // Don't forget this!
        //     linearGradientProps={{
        //         colors: ['red', 'pink'],
        //         start: { x: 0, y: 0.5 },
        //         end: { x: 1, y: 0.5 },
        //     }}
        //     />
        //     {/* <View className="top-0 fixed bg-green-400 w-full">
        //         <View className="display flex-row justify-evenly space-x-10">
        //             <Text style={styles.title}>Drawer</Text>
        //             <Text style={styles.title}>Logo</Text>
        //             <Text style={styles.title}>Notifications</Text>

        //         </View>
        //     </View> */}
        //     <Text style={styles.title}>Welcome to the Home Page!</Text>
        //     <Text style={styles.title}>Welcome home broski</Text>
        // </View>
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
