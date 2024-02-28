import { Tabs } from 'expo-router';
import Index from '.';
import { AntDesign } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import COLOURS from '../../static/design_constants';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';




export default function Layout() {
    return (
        <Tabs 
        screenOptions={{
            tabBarActiveTintColor: COLOURS.BRAND_COLORDARK_GREEN
        }}
           
        >
            <Tabs.Screen
            name="index"
            href="/index"
            options={{
                title:"Home",
                tabBarIcon:({color}) => (
                    <AntDesign name="home" size={24} color={color} />
                )  
            }}
            />

            <Tabs.Screen
            name="stats"
            href="/stats"
            options={{
                title:"Statistics",
                tabBarIcon:({color}) => (
                    <Entypo name="line-graph" size={24} color={color} />
                )  
            }}
            />

            <Tabs.Screen
            name="social"
            href="/social"
            options={{
                title:"Social",
                tabBarIcon:({color}) => (
                    <FontAwesome5 name="users" size={24} color={color} />
                )
            }}
            />

            <Tabs.Screen
            name="profile"
            href="/profile"
            options={{
                title:"Your profile",
                tabBarIcon:({color}) => (
                    <FontAwesome5 name="user" size={24} color={color} />
                )  
            }}
            />

            <Tabs.Screen
            name="notifications"
            href="/notifications"
            options={{
                href:null
            }}
            />

            <Tabs.Screen
            name="editProfile"
            href="/editProfile"
            options={{
                href:null
            }}
            />
            <Tabs.Screen
            name="session"
            href="/session"
            options={{
                href:null
            }}
            />

        </Tabs>
    );
}