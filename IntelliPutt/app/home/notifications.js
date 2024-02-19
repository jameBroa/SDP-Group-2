import React, { useEffect, useState } from "react";
import { View, Text, Pressable, RefreshControl, ScrollView } from "react-native";
import NotificationCard from "../../components/NotificationCard";
import { Redirect, router, Stack } from "expo-router";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { useSelector } from 'react-redux';
import db from "../../config/database";
import Chip from "../../components/Chip";
import COLOURS from "../../static/design_constants";
import { filterSeenNotifs } from "../../logic/notifications-logic";

export default function Notifications() {

    // Data vars
    const tabs = ["All", "Unseen", "Seen"];

    //Redux var
    const user = useSelector((state) => state.user.user);

    //State vars
    const [allCards, setAllCards] = useState([]);
    const [currentCards, setCurrentCards] = useState([]);
    const [allData, setAllData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [notifsDisplayed, setNotifsDisplayed] = useState(tabs[0]);

    // Firebase vars
    const friendRequestCollection = collection(db, "friendRequests");
    const friendRequestQuery = query(friendRequestCollection, where("to", "==", user.uid))


    if (user == null) {
        return <Redirect to="/app/" />
    }

     useEffect(() => {
        if(user) {
            const queryFriends = async() => {
                const q = query(friendRequestCollection, where("to", "==", user.uid));
                const response = await getDocs(q);
                let requests = []
                let data = []
                response.docs.map((doc) => {
                    requests.push(doc.id);
                    data.push(doc.data());
                })
                setAllData(data);
                console.log(requests);
                console.log("^^^^^^^^^^^^^^^^")
                setCurrentCards(requests);
                setAllCards(requests)
            }
        queryFriends();
        }
        
    }, [user.uid])

    useEffect(() => {
        switch(notifsDisplayed) {
            case "All":
                setCurrentCards(allCards);
                break;
            case "Unseen":
                break;
            case "Seen":
                const seenIds = filterSeenNotifs(allData);
                setCurrentCards(seenIds);
                console.log(seenIds);
                console.log("ids which have been pegged 'seen' ")

                break;
        }

    }, [notifsDisplayed])

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
                    }>
                    {currentCards.map((card) => (
                        <NotificationCard {...card} key={card} id={card}/>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
};


