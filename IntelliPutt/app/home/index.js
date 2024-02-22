{/* 
    HOME PAGE
    User is directed here after logging in.
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
import { collection, doc, getDoc, getDocs, query, where, and } from 'firebase/firestore';
import ReduxStateUpdater from '../../context/util/updateState';

export default function Index() {
    // Firebase vars
    const friendRequestCollection = collection(db, "friendRequests");

    // Redux vars
    const user = useSelector((state) => state.user.user);

    // State management
    const [loaded, setLoaded] = useState(false);
    const [friends, setFriends] = useState(new Map());
    const [refreshing, setRefreshing] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);

    const getNumNotifications = async() => {
        const q = query(friendRequestCollection, 
            and(
                where("to", "==", user.uid), where("status", "==", "pending")
            ));
        const response = await getDocs(q);
        setUnreadNotifications(response.docs.length == 0 ? false : true);
    }

    const updateFriends = () => {
        // compare against friends in state
        user["friends"].forEach(friendUID => {
            getDoc(doc(db, "users", friendUID))
                .then((d) => {
                    console.log("Friend data: ", d.data());
                    
                    const friendData = {
                        name: d.data()["name"],
                        skill: d.data()["experienceLevel"],
                        uid: d.data()["uid"]
                    };
                    
                    // if not in friends, add to friends
                    if (friends.has(friendUID) == false) {
                        friends.set(friendUID, friendData);
                        setFriends(new Map(friends));
                    }
                })
        });
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        ReduxStateUpdater.fetchFriends(user);
        updateFriends();
        getNumNotifications();
        setTimeout(() => setRefreshing(false), 1000);
    }, [])

    useEffect(() => {
        // Check if user is logged in
        // If not, redirect to login page
        if (!user && loaded) {
            router.replace(".././");
        }
    }, [user, loaded]);
    
    if (user) {
        if (!loaded) {
            setLoaded(true);
            updateFriends();
            getNumNotifications();
        };

        return (
            <View className="h-full w-full flex flex-col">
                <View className="h-[30%]">
                    <DefaultContainer subheading="Welcome back!" heading={user.name} number={unreadNotifications}/>
                </View>

                <ScrollView contentContainerStyle={styles.wrapper} className="w-full flex flex-col space-y-1 "
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View className="my-2">
                        <Text className="text-xl text-gray-400 pl-3 pt-3 font-medium">Your Friends</Text>
                        <Link className="absolute mt-4 right-[5%] text-gray-600 text-sm" href="/home/social">
                            <Text className="text-sm font-light">View all</Text>
                        </Link>
                        <View className="mt-2 w-full flex flex-row justify-start ml-2">
                            {Array.from(friends).map(([key, value]) => (
                                <FriendButton key={key} friend={value} online />
                            ))}
                        </View>
                    </View>
                    <View className="my-2">
                        <Text className="text-xl text-gray-400 pl-3 mt-1 font-medium">Your Stats</Text>
                        <Link className="absolute mt-2 right-[5%] text-gray-600 text-sm" href="./stats">
                            <Text className="text-sm font-light">View all</Text>
                        </Link>
                        <View className="mt-2 w-full flex flex-row justify-around">
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
