import * as React from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Link, Stack, router } from 'expo-router';
import BackButton from '../../components/BackButton';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function Achievements() {
    const user = useSelector((state) => state.user.user);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, [])


    React.useEffect(() => {
    }, []);

    return (
        <View className="w-full h-full flex flex-col items-center bg-brand-colordark-green">
            <Stack.Screen options={{headerShown:false}}></Stack.Screen>
            <View className="h-[30%] w-full items-center justify-center mb-4">
                <BackButton className="h-[5%]" action={() => router.replace("/home/profile")} />
                <View className="flex-row justify-end items-center mb-10 absolute left-[10%] top-[80%]">
                    <View className="flex-row mb-2">
                        <Text className="font-semibold text-3xl text-stone-50">Your achievements</Text>
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.wrapper} className="h-[60%] w-full flex flex-col rounded-t-3xl px-[4%] bg-stone-100 pt-5"
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                <View style={styles.container} className="h-full my-2 py-2">
                    <View className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-4 mx-3 mb-3">
                        <MaterialCommunityIcons name="clock-fast" size={35} color="black" />
                        <Text className="my-1 font-medium text-base">Velocity Virtuoso</Text>
                        <Text className="px-10 my-2">Mastered speed control and consistently sinked putts with varying speed requirements.</Text>
                    </View>
                    <View className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-4 mx-3 mb-3">
                        <MaterialIcons name="child-care" size={35} color="black" />
                        <Text className="my-1 font-medium text-base">Putting Prodigy</Text>
                        <Text className="px-10 my-2">Awarded for consistently achieving a high putting accuracy percentage over multiple sessions.</Text>
                    </View>
                    <View className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-4 mx-3 mb-3">
                        <MaterialIcons name="leaderboard" size={35} color="black" />
                        <Text className="my-1 font-medium text-base">Top of Leaderboard</Text>
                        <Text className="px-10 font-base my-2">Awarded for reaching the top position on the global leaderboard for putting accuracy or total points earned.</Text>
                    </View>

                </View>

            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    wrapper: {
        justifyContent: 'between',
    },
});

