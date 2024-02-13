{/* 
    HOME PAGE
    User is directed here after logging in.

    (needs to be implemented)
*/}

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import StatsGraphic1 from '../../static/images/test-image-2.png'
import StatsGraphic2 from '../../static/images/test-image-3.png';
import StatsGraphic3 from '../../static/images/test-image-4.png';
import FriendButton from '../../components/FriendButton';
import StatsButton from '../../components/StatsButton';
import GuidesButton from '../../components/GuidesButton';
import DefaultContainer from '../../components/DefaultContainer';
import { useSelector } from 'react-redux';
import { Link, router } from 'expo-router';
import db from '../../config/database';
import { doc, getDoc } from 'firebase/firestore';

export default function Index() {
    const user = useSelector((state) => state.user.user);
    const [loaded, setLoaded] = useState(false);
    const [friends, setFriends] = useState(
        [{
            "name": "John Doe",
            "skill": "Beginner"
        }]
    );
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        runningListOfFriends = [];
        getDoc(doc(db, "users", user["uid"]))
        .then((d) => {
            const listOfUIDs = d.data()["friends"];
            console.log("List of UIDs: ", listOfUIDs);
            listOfUIDs.forEach(friendUID => {
                getDoc(doc(db, "users", friendUID))
                .then((d) => {
                    console.log("Friend data: ", d.data());
                    
                    setFriends(friends.concat({
                        name: d.data()["name"],
                        skill: d.data()["experienceLevel"],
                        uid: d.data()["uid"]
                    }));
                })
            })
            setFriends(runningListOfFriends);
        });

        setTimeout(() => setRefreshing(false), 2000);
    }, [])

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

                <ScrollView contentContainerStyle={styles.wrapper} className="w-full flex flex-col space-y-1 "
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View className="my-2">
                        <Text className="text-xl text-gray-400 pl-3 pt-3 font-medium">Your Friends</Text>
                        <Link className="absolute mt-4 right-[5%] text-gray-600 text-sm" href="./stats">
                            <Text className="text-sm font-light">View all</Text>
                        </Link>
                        <View className="mt-2 w-full flex flex-row justify-around  ">
                            {friends.map((friend) => {
                                return <FriendButton name={friend.name} skill={friend.skill} key={friend.uid} online/>
                            })}
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
