{/* 
    HOME PAGE
    User is directed here after logging in.
*/}

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable, TextInput } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import DefaultContainer from '../../components/DefaultContainer';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import db from '../../config/database';
import { collection, doc, getDoc, getDocs, query, where, and } from 'firebase/firestore';
import { useReduxStateUpdater } from '../../context/util/updateState';
import session from 'redux-persist/lib/storage/session';

export default function Index() {
    const serverAddress = "charmander:5000";

    // Firebase vars
    const friendRequestCollection = collection(db, "friendRequests");

    // Redux vars
    const user = useSelector((state) => state.user.user);
    const { fetchFriends } = useReduxStateUpdater();

    // State management
    const [loaded, setLoaded] = useState(false);
    const [friends, setFriends] = useState(new Map());
    const [refreshing, setRefreshing] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const [sessionOn, setSession] = useState(false);
    const [lastSession, setLastSession] = useState(new Map());
    const [isServerOnline, setServerOnline] = useState(true);
    const [connectedToFrame, setConnectedToFrame] = useState(false);
    const [sessionType, setSessionType] = useState("");
    const [isGameOn, setGameOn] = useState(false);
    const [frameID, setFrameID] = useState("");

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

    const connectToFrame = async () => {
        let response;
        
        try {
            console.log("Requesting to connect with frame...");
            response = await axios.get('http://' + serverAddress + '/connect/' + frameID);

            if (response.status === 200) {
                console.log(response.data);
                setConnectedToFrame(true);
            } else if (response.status === 400) {
                alert("Frame not found.", "Frame " + frameID + " doesn't seem to be in the network.");
                setConnectedToFrame(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const startSoloSession = async () => {
        let response;
        try {
            console.log("Starting session...");
            response = await axios.get('http://' + serverAddress + '/session/solo/request_start/' + user.uid);
            if (response.status === 200) {
                console.log(response.data);
                alert("Session started");
                setSession(true);
                setSessionType("solo");
                setGameOn(true);
            } else if (response.status === 400) {
                alert("You already have a session running");
            } else {
                alert("Session didn't start because it found a " + response.status);
            }
        } catch (error) {
            if (error.request) {
                alert("Server is offline, refresh to check.");
                isServerOnline(false);
            }
            console.error('Error fetching data:', error);
        }
    };  

    const startGroupSession = async () => {
        let response;
        try {
            console.log("Starting session...");
            response = await axios.get('http://' + serverAddress + '/session/group/request_start/' + user.uid);
            if (response.status === 200) {
                console.log(response.data);
                alert("Session started");
                setSession(true);
                setSessionType("group");
                setGameOn(true);
            } else if (response.status === 400) {
                alert("You already have a session running");
            } else {
                alert("Session didn't start because it found a " + response.status);
            }
        } catch (error) {
            if (error.request) {
                alert("Server is offline, refresh to check.");
                isServerOnline(false);
            }
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

    const stopSession = async () => {
        if (sessionOn) {
            console.log("Ending session...");
            response = await axios.get('http://' + serverAddress + '/session/request_end/' + user.uid);
            if (response.status === 200) {
                console.log(response.data);
                setSession(false);
                setSessionType("");
                setGameOn(false);
            } else if (response.status === 400) {
                alert("There was no session running");
            } else {
                console.error(response.data);
            }
        }
    }

    const handleGetLastSession = async () => {
        const q = query(
            collection(db, "sessions"), 
            where("uid", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

      const d = querySnapshot.docs[0].data();

        setLastSession({
            "duration": d.sessionEnded.seconds - d.sessionStarted.seconds,
            "date": new Date(d.sessionStarted.seconds * 1000).toDateString().split(" ").slice(0, 3).join(" "),
            "time": new Date(d.sessionStarted.seconds * 1000).toLocaleTimeString().split(":").slice(0, 2).join(":")
        })
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchFriends();
        checkServerStatus();
        updateFriends();
        getNumNotifications();
        handleGetLastSession();
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
            handleGetLastSession();
            getNumNotifications();
        };

        return (
            <View className="h-full w-full flex flex-col">
                <View className="h-[30%]">
                    <DefaultContainer subheading="Welcome back," heading={user.name + "!"} number={unreadNotifications}/>
                </View>

                <ScrollView contentContainerStyle={styles.wrapper} className="flex flex-col space-y-1"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    
                    {(connectedToFrame) ? 
                        <View className="mt-2 h-[100px]">
                            <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                                <Pressable className="w-[90%] h-full justify-center items-center rounded-xl bg-stone-200" onPress={connectToFrame}>
                                <View className="flex flex-row justify-evenly">
                                        <Text className="text-stone-600 mt-1 font-semibold text-base mr-2">Step 1: Connect to frame</Text>
                                        <Ionicons name="checkmark-circle" size={28} color="grey" /> 
                                    </View>
                                </Pressable>
                            </View>
                        </View> 
                        :
                        <View className="mt-2 h-[200px]">
                            <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                                <View className="w-[90%] h-full justify-center items-center rounded-xl bg-brand-colordark-green">
                                    <View className="flex flex-row justify-evenly mb-5">
                                        <Text className="text-stone-100 mt-1 font-semibold text-base mr-2">Step 1: Connect to frame</Text>
                                    </View>
                                    <TextInput 
                                        placeholder='Frame ID'
                                        onChangeText={setFrameID}
                                        style={{borderWidth: 1, borderColor: 'black', borderRadius: 5, width: 250, height: 50, color: 'black', backgroundColor: 'white', paddingHorizontal: 10, fontSize: 16}}
                                        maxLength={10}
                                    />
                                    <Pressable className="mt-4 py-2 items-center rounded-lg bg-stone-200 w-[25%]" onPress={connectToFrame}>
                                        <Text className="font-medium text-sm font-brand-colordark-green">Connect</Text>
                                    </Pressable> 
                                </View>
                            </View>
                        </View> 
                    }

                    {(connectedToFrame && !sessionOn) &&
                        <View className="my-2 h-[180px] flex flex-col ">
                            <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                                <View className="w-[90%] h-full justify-center items-center rounded-xl bg-brand-colordark-green">
                                    <View className="flex flex-row justify-evenly">
                                        <Text className=" text-stone-200 mt-1 font-semibold text-base mr-2">Step 2: Start a session</Text>
                                    </View>

                                    <View className="flex flex-row justify-evenly pt-5">
                                        <Pressable className="ml-5 items-center w-[40%] bg-stone-200 py-2 rounded-lg" onPress={startSoloSession}>
                                            <FontAwesome name="user" size={30} color="grey" />
                                            <Text className="text-stone-600 font-medium mt-1 text-sm">Solo</Text>
                                        </Pressable>
                                        <Text className="text-base font-medium pt-5 text-stone-200 pl-2">or</Text>
                                        <Pressable className="ml-3 items-center mr-5 w-[40%] bg-stone-200 py-2 rounded-lg" onPress={startGroupSession}>
                                            <FontAwesome name="group" size={30} color="grey" />
                                            <Text className="text-stone-600 font-medium mt-1 text-sm">Group</Text>
                                        </Pressable>
                                    </View>
                                </View>    
                            </View>                    
                        </View>              
                    } 

                    {(connectToFrame && sessionOn) &&
                        <View className="my-2 h-[100px] flex flex-col">
                        <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                            <View className="w-[90%] h-[100px] justify-center items-center rounded-xl bg-stone-200">
                                <View className="flex flex-row justify-evenly">
                                    <Text className=" text-stone-600 mt-1 font-semibold text-base mr-2">Step 2: Start a session</Text>
                                        <Ionicons name="checkmark-circle" size={28} color="grey" />  
                                </View>
                            </View>
                        </View>
                    </View>
                    }


                    {(sessionType === "group" && sessionOn && !isGameOn) && 
                        <View className="my-2 h-[180px] flex flex-col">
                            <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                                <View className="w-[90%] h-full justify-center items-center rounded-xl bg-brand-colordark-green">
                                    <View className="flex flex-row justify-evenly">
                                        <Text className=" text-stone-200 mt-1 font-semibold text-base mr-2">Step 3: Wait for friends to join</Text>
                                    </View>

                                    <View className="flex flex-row justify-evenly pt-5">
                                        <Text className=" text-stone-200 mt-2 font-semibold text-base mx-2">3 people in session</Text>
                                        <Pressable className="ml-5 items-center mr-5 w-[20%] bg-stone-200 py-2 rounded-lg" onPress={startGroupSession}>
                                                <Text className="text-stone-600 font-medium mt-1 text-sm">Start</Text>
                                        </Pressable>
                                    </View>
                                </View>  
                            </View>                    
                        </View>
                    }

                    {(sessionType === "group" && sessionOn && isGameOn) && 
                        <View className="my-2 h-[100px] flex flex-col">
                            <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                            <View className="w-[90%] h-[100px] justify-center items-center rounded-xl bg-stone-200">
                                <View className="flex flex-row justify-evenly">
                                    <Text className=" text-stone-600 mt-1 font-semibold text-base mr-2">Step 3: Wait for friends to join</Text>
                                        <Ionicons name="checkmark-circle" size={28} color="grey" />  
                                </View>
                            </View> 
                            </View>
                        </View>
                    }

                    {(isGameOn) &&
                    <View className="my-4 h-[160px] flex flex-col">
                        <View className="h-full justify-evenly items-start flex flex-row mt-2">
                            <View className="w-[90%] h-full justify-center items-center rounded-xl bg-brand-colordark-green pt-5">
                                <View className="flex flex-row justify-evenly pt-2">
                                    <Text className=" text-stone-200 font-semibold text-base mr-2">Step 4: Play</Text>
                                </View>

                                <View className="flex flex-row justify-evenly">
                                    <Pressable className="pt-2 mt-5 mb-5 items-center w-[60%] h-[70px] rounded-lg" onPress={stopSession}>
                                        <FontAwesome name="pause" size={30} color="white" />
                                        <Text className="text-stone-100 font-medium mt-1 text-sm">Stop session</Text>
                                    </Pressable>
                                </View>
                            </View>    
                        </View>                                       
                    </View>
                    }
                               
                    {/* <View className="my-2 h-[50%] mb-5">
                        <Text className="text-lg text-gray-400 pl-3 mt-1 font-medium mb-1">Last session - {lastSession.date} at {lastSession.time}</Text>
                        <View className="h-[90%] justify-evenly items-start flex flex-row">
                            <View className="bg-stone-200 w-[40%] h-full justify-center items-center flex flex-row rounded-xl">
                            <FontAwesome6 className="" name="clock" size={30} color="grey" />
                            <View className="pl-4">
                                <Text className="text-stone-600 font-base font-semibold">Duration</Text>
                                <Text className="text-base text-stone-600 font-base font-bold">{lastSession.duration}</Text>
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
                    </View> */}
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
