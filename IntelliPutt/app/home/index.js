{/* 
    HOME PAGE
    User is directed here after logging in.

    (needs to be implemented)
*/}

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import StatsGraphic1 from '../../static/images/test-image-2.png'
import StatsGraphic2 from '../../static/images/test-image-3.png';
import StatsGraphic3 from '../../static/images/test-image-4.png';
import FriendButton from '../../components/FriendButton';
import StatsButton from '../../components/StatsButton';
import GuidesButton from '../../components/GuidesButton';
import DefaultContainer from '../../components/DefaultContainer';
import { useSelector } from 'react-redux';
import { Link, router } from 'expo-router';


export default function Index() {

    // Redux vars
    const user = useSelector((state) => state.user.user);
    const uid = user.uid;

    // State management
    const [loaded, setLoaded] = useState(false);
    


    useEffect(() => {
        // Check if user is logged in
        // If not, redirect to login page
        if (!user && loaded) {
            router.replace(".././");
        }
    }, [user, loaded]);
    
    if (user) {
        if (!loaded) {setLoaded(true)};
        return (
            <View className="h-full w-full flex flex-col ">
                
                <View className="h-[30%]">
                    <DefaultContainer subheading="Welcome back!" heading={user["name"]}/>
                </View>

                <ScrollView contentContainerStyle={styles.wrapper} className="w-full flex flex-col space-y-1 ">
                    <View className="my-2">
                        <Text className="text-xl text-gray-400 pl-3 pt-3 font-medium">Your Friends</Text>
                        <Link className="absolute mt-4 right-[5%] text-gray-600 text-sm" href="./stats">
                            <Text className="text-sm font-light">View all</Text>
                        </Link>
                        <View className="mt-2 w-full flex flex-row justify-around  ">
                            {/* TODO: Wrap in Pressables */}
                            <FriendButton name={"Joe"} skill={"Advanced"} online/>
                            <FriendButton name={"Adam"} skill={"Beginner"} online/>
                            <FriendButton name={"Matt"} skill={"Beginner"} offline/>
                        </View>
                    </View>
                    <View className="my-2">
                        <Text className="text-xl text-gray-400 pl-3 mt-1 font-medium">Your Stats</Text>
                        <Link className="absolute mt-2 right-[5%] text-gray-600 text-sm" href="./stats">
                            <Text className="text-sm font-light">View all</Text>
                        </Link>
                        <View className="mt-2 w-full flex flex-row justify-around ">
                            {/* TODO: Wrap in Pressables */}
                            <StatsButton day={"Monday"} numToReview={"12"} imgSrc={StatsGraphic1}/>
                            <StatsButton day={"Tuesday"} numToReview={"5"} imgSrc={StatsGraphic2}/>
                            <StatsButton day={"Wednesday"} numToReview={"8"} imgSrc={StatsGraphic3}/>
                        </View>
                    </View>
                    <View className="my-2">
                        <Text className="text-xl text-gray-400 pl-3 mt-1 font-medium">Recommended Guides</Text> 
                        <Link className="absolute mt-2 right-[5%] text-gray-600 text-sm" href="./stats">
                            <Text className="text-sm font-light">View all</Text>
                        </Link>
                        <View className="mt-2 w-full flex flex-row justify-around ">
                            {/* TODO: Wrap in Pressables */}
                            <GuidesButton title={"Putting Tutorial"}/>
                            <GuidesButton title={"Control Tips"}/>
                            <GuidesButton title={"Staying Consistent"}/>
                        </View>
                    </View>
                </ScrollView>
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
    wrapper: {
        justifyContent: 'between',
    },
});
