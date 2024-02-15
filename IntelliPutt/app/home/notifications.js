import React, { useState } from "react";
import { View, Text, Pressable, RefreshControl, ScrollView } from "react-native";
import NotificationCard from "../../components/NotificationCard";
import { Redirect, router, Stack } from "expo-router";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { useSelector } from 'react-redux';
import db from "../../config/database";

export default function Notifications() {
    const user = useSelector((state) => state.user.user);

    if (user == null) {
        return <Redirect to="/app/" />
    }

    const [cards, setCards] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const friendRequestQuery = query(collection(db, "friendRequests"), where("to", "==", user.uid));
    const response = getDocs(friendRequestQuery);
    response.then((querySnapshot) => {
        const requests = [];
        for (const doc of querySnapshot.docs) {
            requests.push(doc.id);
        }
        setCards(requests);
    })

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        const unsubscribe = onSnapshot(friendRequestQuery, async (querySnapshot) => {
            const requests = [];
            for (const doc of querySnapshot.docs) {
                requests.push(doc.id);
            }
            setCards(requests);
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
                    <Text className="font-bold text-2xl text-lime-900">Notifications</Text>
                </View>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {cards.map((card) => (
                    <NotificationCard {...card} key={card} id={card} />
                ))}
            </ScrollView>
        </View>
    )
};


