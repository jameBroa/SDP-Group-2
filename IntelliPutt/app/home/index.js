{/* 
    HOME PAGE
    User is directed here after logging in.
*/}

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import FriendButton from '../../components/FriendButton';
import { Ionicons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import DefaultContainer from '../../components/DefaultContainer';
import { useSelector } from 'react-redux';
import { Link, router } from 'expo-router';
import db from '../../config/database';
import { collection, doc, getDoc, getDocs, query, where, and } from 'firebase/firestore';
import ReduxStateUpdater from '../../context/util/updateState';

export default function Index() {
    const serverAddress = "172.24.49.226:5000";

    // Firebase vars
    const friendRequestCollection = collection(db, "friendRequests");

    // Redux vars
    const user = useSelector((state) => state.user.user);

    // State management
    const [loaded, setLoaded] = useState(false);
    const [friends, setFriends] = useState(new Map());
    const [refreshing, setRefreshing] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const [sessionOn, setSession] = useState(false);
    const [lastSession, setLastSession] = useState(new Map());
    const [isServerOnline, setServerOnline] = useState(false);

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
    }

    const handleSession = async () => {
        let response;
        try {
            if (sessionOn) {
                console.log("Ending session...");
                response = await axios.get('http://' + serverAddress + '/session/request_end/' + user.uid);
                if (response.status === 200) {
                    console.log(response.data);
                    setSession(false);
                } else if (response.status === 400) {
                    alert("There was no session running");
                } else {
                    console.error(response.data);
                }
            } else {
                console.log("Starting session...");
                response = await axios.get('http://' + serverAddress + '/session/request_start/' + user.uid);
                if (response.status === 200) {
                    console.log(response.data);
                    alert("Session started");
                    setSession(true);
                } else if (response.status === 400) {
                    alert("You already have a session running");
                } else {
                    alert("Session didn't start because it found a " + response.status);
                }
            }
        } catch (error) {
            if (error.request)
            console.error('Error fetching data:', error);
        }
    };  

    const checkServerStatus = async () => {
        try {
            let response = await axios.get("http://" + serverAddress + "/isAlive");
            if (response.status === 200) {
                setServerOnline(true);
            } else {
                setServerOnline(false);
            }
        } catch {
            setServerOnline(false);
        }
    }

    const handleGetLastSession = async () => {
        const q = query(
            collection(db, "sessions"), 
            where("uid", "==", user.uid)
        ).orderBy("sessionStarted", "desc").limit(1).get();;
        const response = await getDocs(q);

        d = response.data();

        setLastSession({
            "duration": d["sessionStarted"] - d["sessionEnded"],
            "date": d[sessionStarted]
        });
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        ReduxStateUpdater.fetchFriends(user);
        checkServerStatus();
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
            checkServerStatus();
            updateFriends();
            getNumNotifications();
        };

        return (
            <View className="h-full w-full flex flex-col">
                <View className="h-[30%]">
                    <DefaultContainer subheading="Welcome back!" heading={user.name} number={unreadNotifications}/>
                </View>

                <ScrollView contentContainerStyle={styles.wrapper} className="w-full flex flex-col space-y-1"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View className="my-2 h-[30%]">
                        <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                            {(isServerOnline) ?
                            <Pressable className="bg-brand-colordark-green w-[95%] h-full justify-center items-center rounded-xl" onPress={handleSession}>
                                {(sessionOn) ?
                                 <Ionicons name="stop-circle" size={45} color="white" /> 
                                 : 
                                 <Ionicons name="play" size={45} color="white" /> 
                                }
                                {(sessionOn) ?
                                 <Text className="text-white mt-1">Stop session</Text>
                                 : 
                                 <Text className=" text-white mt-1">Start session</Text>
                                }
                            </Pressable> :
                            <View className="bg-stone-400 w-[95%] h-full justify-center items-center rounded-xl" onPress={checkServerStatus}>
                                <Ionicons name="cloud-offline" size={45} color="white" />
                                <Text className="text-white mt-1 font-medium text-base">Server is offline</Text>
                            </View>
                            }
                        </View>
                    </View>   
                               
                    <View className="my-2 h-[20%] mb-5">
                        <Text className="text-lg text-gray-400 pl-3 mt-1 font-medium mb-1">Last session - Wed 6th</Text>
                        <View className="h-[90%] justify-evenly items-start flex flex-row">
                            <View className="bg-stone-200 w-[40%] h-full justify-center items-center flex flex-row rounded-xl">
                            <FontAwesome6 className="" name="clock" size={30} color="grey" />
                            <View className="pl-4">
                                <Text className="text-stone-600 font-base font-semibold">Duration</Text>
                                <Text className="text-base text-stone-600 font-base font-bold">50 min</Text>
                            </View>
                            </View>
                            <View className="bg-stone-200 w-[53.5%] h-full justify-center items-center flex flex-row rounded-xl">
                            <MaterialCommunityIcons name="golf" size={40} color="grey" />
                            <View className="pl-3">
                                <Text className="text-stone-600 font-base font-semibold">Successful putts</Text>
                                <Text className="text-base text-stone-600 font-base font-bold">30%</Text>
                            </View>
                            </View>
                        </View>
                    </View>

                    <View className="my-2 h-[20%] mb-3">
                        <Text className="text-lg text-gray-400 pl-3 pt-3 font-medium mt-1">Achievements</Text>
                        <Link className="absolute mt-4 right-[5%] text-gray-600 text-sm" href="/home/social">
                            <Text className="text-sm font-light mt-3">View all</Text>
                        </Link>
                        <View className="h-[90%] justify-evenly items-start flex flex-row">
                            <View className="bg-stone-200 w-[30%] h-[95%] justify-center items-center flex flex-row rounded-xl">
                                <FontAwesome6 name="hourglass-2" size={30} color="grey" />
                            </View>
                            <View className="bg-stone-200 w-[30%] h-[95%] justify-center items-center flex flex-row rounded-xl">
                                <FontAwesome6 className="" name="hourglass" size={30} color="grey" />
                            </View>
                            <View className="bg-stone-200 w-[30%] h-[95%] justify-center items-center flex flex-row rounded-xl">
                                <FontAwesome6 className="" name="stopwatch-20" size={30} color="grey" />
                            </View>
                        </View>
                    </View>

                    <View className="pt-2">
                        <Text className="text-lg text-gray-400 pl-3 pt-3 font-medium mt-1">Your friends</Text>
                        <Link className="absolute mt-4 right-[5%] text-gray-600 text-sm" href="/home/social">
                            <Text className="text-sm font-light mt-3">View all</Text>
                        </Link>
                        <View className="mt-1 w-full flex flex-row justify-start ml-2">
                            {Array.from(friends).map(([key, value]) => (
                                <FriendButton key={key} friend={value} online />
                            ))}
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
