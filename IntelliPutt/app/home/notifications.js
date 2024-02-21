import React, { useEffect, useState } from "react";
import { View, Text, Pressable, RefreshControl, ScrollView } from "react-native";
import NotificationCard from "../../components/NotificationCard";
import { Redirect, router, Stack } from "expo-router";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { useSelector } from 'react-redux';
import db from "../../config/database";
import Chip from "../../components/Chip";
import COLOURS from "../../static/design_constants";
import { filterSeenNotifs, filterUnseenNotifs } from "../../logic/notifications-logic";

export default function Notifications() {
    // Data vars
    const tabs = ["All", "Unseen", "Seen"];

    //Redux var
    const user = useSelector((state) => state.user.user);

    //State vars
    const [allCards, setAllCards] = useState([]);           //Card == document id of a friend request
    const [currentCards, setCurrentCards] = useState([]);
    const [zippedData, setZippedData] = useState([]);       // Zips card and data so document id need not be fetched.
    const [refreshing, setRefreshing] = useState(false);
    const [notifsDisplayed, setNotifsDisplayed] = useState(tabs[0]);
    const [usersInfo, setUsersInfo] = useState([]);         // So NotificationsCard.js doesn't need to query FB everytime
    const [loaded, setLoaded] = useState(false);
    const [globalData, setGlobalData] = useState([]);
    const [currentData, setCurrentData] = useState([]);

    // Firebase vars
    const friendRequestCollection = collection(db, "friendRequests");
    const usersCollection = collection(db, "users");
    const friendRequestQuery = query(friendRequestCollection, where("to", "==", user.uid))

    // Base case
    if (user == null) {
        return <Redirect to="/app/" />
    }
    
    // Manages retrieving user data
    useEffect(() => {
        if(user) {

            async function _getValidUsersInfo(input){
                let promises = input.map(async (data) => {
                    const q = query(usersCollection, where("uid", "==", data[0].from))
                    const response = await getDocs(q);
                    return (response.docs[0].data())
                })
                let res = await Promise.all(promises)
                
                userMap = {}
                res.map((temp) => {
                    userMap[temp.uid] = temp;
                })

                // console.log(userMap)
                // console.log("userMap")

                setUsersInfo(userMap);
                setLoaded(true);

                
            }
            
            // Takes zipped input
            // Should filter out invalid users by checking the 'from' tag. 
            // No need to check 'to', since user is logged in at that point
            // implying its validity.
            async function _filterValidRequests(input) {
                const q = query(usersCollection)
                const response = await getDocs(q);
                let uids = []
                response.docs.map((doc) => {
                    uids.push(doc.data().uid);
                })

                let res = []
                
                input.map((item) => {
                    if(uids.includes(item[0].from)){
                        res.push(item);
                    }
                })

                return res; 
            }

            const _queryFriends = async() => {
                const q = query(friendRequestCollection, where("to", "==", user.uid));
                const response = await getDocs(q);
                let requests = []
                let data = []
                response.docs.map((doc) => {     
                    requests.push(doc.id);
                    data.push(doc.data());
                })
                
                let joined = []
                data.map((d, idx) => {
                    joined.push([d, requests[idx]])
                })

                validRequests = await _filterValidRequests(joined);
                setZippedData(validRequests);
                setCurrentData(validRequests);
                setGlobalData(validRequests);
                // console.log(validRequests)
                _getValidUsersInfo(validRequests);
                // console.log(usersInfo);
                
            }
        _queryFriends();
        console.log("rerunning?")
        }
        
    }, [user.uid, user])

    // Manage tabs switching
    useEffect(() => {
        switch(notifsDisplayed) {
            case "All":
                setCurrentData(globalData);
                break;
            case "Unseen":
                const unseenNotifs = filterUnseenNotifs(globalData);
                setCurrentData(unseenNotifs);
                break;
            case "Seen":
                const seenNotifs = filterSeenNotifs(globalData);
                setCurrentData(seenNotifs);
                break;
        }

    }, [notifsDisplayed])

    // Refresh page
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        const unsubscribe = onSnapshot(friendRequestQuery, async (querySnapshot) => {
            const requests = [];
            for (const doc of querySnapshot.docs) {
                requests.push(doc.id);
            }
            setAllCards(requests);
        });
        setTimeout(() => setRefreshing(false), 2000);
        unsubscribe();
    }, [])

    return (
        <View className="flex-1 bg-white px-10 pt-10">
            <Stack.Screen options={{headerShown:false}}></Stack.Screen>
            <Pressable className="my-[20px]" onPress={() => router.back()}>
                <Text className="text-stone-900 text-[16px] font-medium"> Cancel </Text>
            </Pressable>
            <View className="flex-row justify-between mb-10">
                <View className="flex-row">
                    <Text className="font-bold text-4xl text-brand-colordark-green">Notifications</Text>
                </View>
            </View>
            <View className="divide-y space-y-1">
                {/* tabs */}
                <View className="w-full  flex flex-row justify-around space-x-4">
                    {tabs.map((tab) => {
                        return(
                            <Chip
                            text={tab}
                            selected={notifsDisplayed === tab}
                            setSelected={setNotifsDisplayed}
                            key={tab}
                            color={COLOURS.BRAND_COLORDARK_GREEN}
                            bWidth={100}
                            />
                        )
                    })}

                </View>
                {/* Actual Notifications */}
                <ScrollView
                    className="pt-2 h-96"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    >
                    {loaded && (
                        currentData.map((data) => {
                            return(
                                <NotificationCard reqData={data[0]} userData={usersInfo[data[0].from]} key={data[1]} />
                            )
                        })
                    )}


                    {/* {zippedData.map((data) => (
                        // <NotificationCard {...card} key={card} id={card}/>
                        <NotificationCard reqData={data} userData={usersInfo[data.from]} id={data[1]} />
                    ))} */}
                </ScrollView>
            </View>
        </View>
    )
};


