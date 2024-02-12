import React, { Fragment, useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import NotificationCard from "../../components/NotificationCard";
import { router, Stack } from "expo-router";

function Notifications() {
    const [cards, setCards] = useState([
        {
            name: "Adam",
            email: "adam@gmail.com",
            isRead: false,
            content: (
                <Fragment>
                    <Text className="text-stone-600">
                        sent you a friend request
                    </Text>
                </Fragment>
            ),
            time: "1m",
        },
        {
            name: "Joe",
            email: "joe@gmail.com",
            isRead: false,
            content: (
                <Fragment>
                    <Text className="text-stone-600">
                        sent you a friend request
                    </Text>
                </Fragment>
            ),
            time: "1m",
        }
    ]);

    const [allRead, setAllRead] = useState(false);

    useEffect(() => {
        if (allRead) {
            const tempCards = [...cards];
            setCards(
                tempCards.map((card) => {
                    const index = tempCards.indexOf(card);
                    tempCards[index] = { ...cards[index] };
                    tempCards[index].isRead = true;
                    return tempCards[index];
                })
            );
        }
    }, [allRead]);

    const count = cards.filter((card) => !card.isRead).length;

    return (
        <View className="flex-1 bg-white px-10 pt-10">
            <Stack.Screen options={{headerShown:false}}></Stack.Screen>
            <Pressable className="my-[20px]" onPress={() => router.back()}>
                <Text className="text-stone-900 text-[16px] font-medium"> Cancel </Text>
            </Pressable>
            <View className="flex-row justify-between mb-10">
                <View className="flex-row">
                    <Text className="font-bold text-2xl">Notifications</Text>
                    <View className="bg-lime-800 rounded-full ml-2 px-[10px] py-[5px]">
                        <Text className="text-white text-sm">{count}</Text>
                    </View>
                </View>

                <Text className="text-lime-800 font-bold cursor-pointer" onPress={() => setAllRead(true)} >
                    Mark all as read
                </Text>
            </View>

            {cards.map((card) => (
                <NotificationCard {...card} key={card.name} />
            ))}
        </View>
    );
}

export default Notifications;