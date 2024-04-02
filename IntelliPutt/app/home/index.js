{/* 
    HOME PAGE
    User is directed here after logging in.
*/}

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable, TextInput, Vibration } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DefaultContainer from '../../components/DefaultContainer';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import db from '../../config/database';
import { collection, doc, getDoc, getDocs, query, where, and } from 'firebase/firestore';
import { useReduxStateUpdater } from '../../context/util/updateState';
import { socket } from '../../logic/socket';

export default function Index() {
    // Firebase vars
    const friendRequestCollection = collection(db, "friendRequests");

    // Redux vars
    const user = useSelector((state) => state.user.user);
    const { fetchFriends, fetchVideos } = useReduxStateUpdater();

    // State management
    const [loaded, setLoaded] = useState(false);
    const [friends, setFriends] = useState(new Map());
    const [refreshing, setRefreshing] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const [sessionOn, setSession] = useState(false);

    // Step 1
    const [connectedToFrame, setConnectedToFrame] = useState(false);
    const [frameID, setFrameID] = useState("");

    // Step 2
    const [sessionType, setSessionType] = useState("");
    const [sessionID, setSessionID] = useState("");
    const [joinedOrStarted, setJoinedOrStarted] = useState("");

    // Step 3
    const [numPlayers, setNumPlayers] = useState(1);

    // Step 4
    const [isGameOn, setGameOn] = useState(false);
    
    // Step 5
    const [userTurn, setUserTurn] = useState("");

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

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchFriends();
        updateFriends();
        getNumNotifications();
        setTimeout(() => setRefreshing(false), 1000);
    }, [])

    const handleConnectToFrame = () => {
        socket.connect();
        console.log("Socket connected " + socket.connected);
    }

    useEffect(() => {
        fetchVideos();

        socket.on('frame_connected', () => {
            console.log("WEBSOCKET: Frame connected");
            alert("Connected to frame successfully.")
            setConnectedToFrame(true);
        });

        socket.on('released_ball', () => {
            console.log("WEBSOCKET: Ball released");
            alert("Ball released.");
        });

        socket.on('frame_not_found', () => {
            console.log("WEBSOCKET: Frame not found");
            alert("Frame not found.");
            setConnectedToFrame(false);
        });

        socket.on('solo_session_started', ({ user_id, session_id }) => {
            console.log("WEBSOCKET: Solo session started:", user_id, session_id);
            setSession(true);
            setSessionType("solo");
            setSessionID(session_id);
            setJoinedOrStarted("started");
            setGameOn(true);
        });

        socket.on('group_session_started', ({ user_id, session_id }) => {
            console.log("WEBSOCKET: Group session started:", user_id, session_id);
            setSession(true);
            setSessionType("group");
            setSessionID(session_id);
            setJoinedOrStarted("started");
        });

        socket.on('session_denied', ({ message }) => {
            console.log("WEBSOCKET: Session denied:" + message);
            alert(message);
        });

        socket.on('group_game_started', () => {
            console.log("WEBSOCKET: Game started");
            setGameOn(true);
        });

        socket.on('num_players_updated', ({ numPlayers }) => {
            console.log("WEBSOCKET: Number of players updated to " + numPlayers);
            setNumPlayers(numPlayers);
        });

        socket.on('session_ended', () => {
            console.log("WEBSOCKET: Session ended");
            setSession(false);
            setSessionType("");
            setSessionID("");
            setJoinedOrStarted("");
            setNumPlayers(1);
            setGameOn(false);
        });

        socket.on('group_session_joined', ({ user_id, session_id }) => {
            console.log("WEBSOCKET: Group session joined by ", user_id, session_id);
            setSession(true);
            setSessionType("group");
            setSessionID(session_id);
            setJoinedOrStarted("joined");
        });

        socket.on('group_game_whose_turn', ({ user_id }) => {
            console.log("WEBSOCKET: " + user_id + "'s turn");

            if (user_id === user.uid) {
                Vibration.vibrate();
            }

            setUserTurn(user_id);
        });

        return () => {
            // Clean up event listeners when unmounting
            socket.off('session_started');
            socket.off('session_denied');
            socket.off('game_started');
            socket.off('num_players_updated');
            socket.off('session_ended');
            socket.off('session_joined');
            socket.off('group_game_whose_turn');
            socket.off('frame_connected');
            socket.off('released_ball');
        };
    }, []);

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
                    <DefaultContainer subheading="Welcome back," heading={user.name + "!"} number={unreadNotifications}/>
                </View>

                <ScrollView contentContainerStyle={styles.wrapper} className="flex flex-col space-y-1"
                    automaticallyAdjustKeyboardInsets={true}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    
                    {/* STEP 1 - CONNECT TO FRAME */}
                    {(connectedToFrame) ? 
                        <View className="mt-2 h-[100px]">
                            <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                                <Pressable className="w-[90%] h-full justify-center items-center rounded-xl bg-stone-200" onPress={() => socket.emit('connect_to_frame', frameID)}>
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
                                    <Pressable className="mt-4 py-2 items-center rounded-lg bg-stone-200 w-[25%]" onPress={() => {
                                        handleConnectToFrame();
                                        socket.emit('connect_to_frame', frameID);
                                        }}>
                                        <Text className="font-medium text-sm font-brand-colordark-green">Connect</Text>
                                    </Pressable> 
                                </View>
                            </View>
                        </View> 
                    }

                    {/* STEP 2 - START OR CONNECT TO SESSION */}
                    {(connectedToFrame && !sessionOn) &&
                        <View className="my-2 h-[350px] flex flex-col ">
                            <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                                <View className="w-[90%] h-full justify-center items-center rounded-xl bg-brand-colordark-green">
                                    <View className="flex flex-row justify-evenly">
                                        <Text className=" text-stone-200 mt-1 font-semibold text-base mr-2">Step 2: Start a session</Text>
                                    </View>

                                    <View className="flex flex-row justify-evenly pt-5">
                                        <Pressable className="ml-5 items-center w-[40%] bg-stone-200 py-2 rounded-lg" onPress={() => socket.emit('start_solo_session', user.uid)}>
                                            <FontAwesome name="user" size={30} color="grey" />
                                            <Text className="text-stone-600 font-medium mt-1 text-sm">Solo</Text>
                                        </Pressable>
                                        <Text className="text-base font-medium pt-5 text-stone-200 pl-2">or</Text>
                                        <Pressable className="ml-3 items-center mr-5 w-[40%] bg-stone-200 py-2 rounded-lg" onPress={() => socket.emit('start_group_session', user.uid)}>
                                            <FontAwesome name="group" size={30} color="grey" />
                                            <Text className="text-stone-600 font-medium mt-1 text-sm">Group</Text>
                                        </Pressable>
                                    </View>
                                    
                                    <View className="flex flex-row  mt-5 pb-2">
                                        <Text className=" text-stone-200 mt-1 font-semibold text-base mr-2">Or connect to an existing one</Text>
                                    </View>

                                    <TextInput 
                                        placeholder='Session ID'
                                        onChangeText={setSessionID}
                                        style={{borderWidth: 1, borderColor: 'black', borderRadius: 5, width: 300, height: 50, color: 'black', backgroundColor: 'white', paddingHorizontal: 10, fontSize: 16}}
                                        maxLength={6}
                                    />
                                    <Pressable className="mt-4 py-2 items-center rounded-lg bg-stone-200 w-[25%]" onPress={() => socket.emit('join_group_session', { session_id: sessionID, user_id: user.uid })}>
                                        <Text className="font-medium text-sm font-brand-colordark-green">Connect</Text>
                                    </Pressable> 
                                </View>    
                            </View>                    
                        </View>              
                    }

                    {(connectedToFrame && sessionOn) &&
                        <View className="my-2 h-[100px] flex flex-col">
                        <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                            <View className="w-[90%] h-[100px] justify-center items-center rounded-xl bg-stone-200">
                                <View className="flex flex-row justify-evenly">
                                    <Text className=" text-stone-600 mt-1 font-semibold text-base mr-2">Step 2: Start or connect to session</Text>
                                        <Ionicons name="checkmark-circle" size={28} color="grey" />  
                                </View>
                            </View>
                        </View>
                    </View>
                    }

                    {/* STEP 3 - GROUP SESSION WAIT FOR PLAYERS */}
                    {(sessionType === "group" && sessionOn && !isGameOn) && 
                        <View className="my-2 h-[180px] flex flex-col">
                            <View className="h-[90%] justify-evenly items-start flex flex-row mt-2">
                                <View className="w-[90%] h-full justify-center items-center rounded-xl bg-brand-colordark-green">
                                    <View className="flex flex-row justify-evenly">
                                        <Text className=" text-stone-200 mt-1 font-semibold text-base mr-2">Step 3: Wait for friends to join</Text>
                                    </View>
                                    <View className="flex flex-row justify-evenly">
                                    <Text className=" text-stone-200 mt-1 font-regular text-base mr-2">Give them</Text><Text className="text-stone-200 mt-1 font-bold text-base mr-2">{sessionID.substring(0,6)}</Text>
                                    </View>
                                    
                                    <View className="flex flex-row justify-evenly pt-5">
                                        <Text className=" text-stone-200 mt-2 font-semibold text-base mx-2">{numPlayers} people in session</Text>
                                        {(joinedOrStarted === "started") &&
                                            <Pressable className="ml-5 items-center mr-5 w-[20%] bg-stone-200 py-2 rounded-lg" onPress={() => socket.emit('start_group_game', user.uid)}>
                                                <Text className="text-stone-600 font-medium mt-1 text-sm">Start</Text>
                                            </Pressable>
                                        }
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

                    {/* STEP 3/4 - PLAY */}
                    {(isGameOn && joinedOrStarted === "started") &&
                    <View className="my-4 h-[180px] flex flex-col">
                        <View className="h-full justify-evenly items-start flex flex-row mt-2">
                            <View className="w-[90%] h-full justify-center items-center rounded-xl bg-brand-colordark-green pt-5">
                                <View className="flex flex-row justify-evenly pt-1 mb-2">
                                {(sessionType === "group") ? 
                                    <Text className=" text-stone-200 font-semibold text-base mr-2">Step 4: Play</Text>
                                    :
                                    <Text className=" text-stone-200 font-semibold text-base mr-2">Step 3: Play</Text>
                                }
                                </View>
                                
                                {(sessionType === "group" && userTurn === user.uid) &&
                                    <Text className=" text-stone-100 font-semibold text-base mr-2">It's your turn</Text>
                                }

                                {(sessionType === "group" && userTurn != user.uid) &&
                                    <Text className=" text-stone-200 font-semibold text-base mr-2">Waiting for {userTurn} to play</Text>
                                }

                                <View className="flex flex-row justify-evenly mb-2">
                                    <Pressable className="ml-5 mt-2 items-center mr-5 w-[30%] bg-stone-200 py-3 pt-4 rounded-lg" onPress={() => socket.emit('end_session', user.uid)}>
                                        <FontAwesome name="pause" size={30} color="grey" />
                                        <Text className="text-stone-600 font-medium mt-1 text-sm">Stop session</Text>
                                    </Pressable>
                                    <Pressable className="ml-5 mt-2 items-center mr-5 w-[30%] bg-stone-200 py-3 rounded-lg" onPress={() => socket.emit('release_ball')}>
                                        <MaterialIcons name="report-gmailerrorred" size={35} color="grey" />
                                        <Text className="text-stone-600 font-medium mt-1 text-sm">Release ball</Text>
                                    </Pressable>
                                </View>
                            </View>    
                        </View>                                       
                    </View>
                    }

                    {(isGameOn && joinedOrStarted == "joined") &&
                    <View className="my-4 h-[160px] flex flex-col">
                        <View className="h-full justify-evenly items-start flex flex-row mt-2">
                            <View className="w-[90%] h-full justify-center items-center rounded-xl bg-brand-colordark-green pt-5">
                               <View className="flex flex-row justify-evenly pt-2">
                                <Text className=" text-stone-200 font-semibold text-base mr-2">Step 4: Play</Text>

                                {(userTurn === user.uid) ?
                                    <Text className=" text-stone-200 font-semibold text-base mr-2">Your turn</Text>
                                    :
                                    <Text className=" text-stone-200 font-semibold text-base mr-2">Waiting for {userTurn} to play</Text>
                                }
                               </View>
                            </View>    
                        </View>                                       
                    </View> 
                    }
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
