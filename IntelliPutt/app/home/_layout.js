import { Stack, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';

export default function Layout() {
    return (
        <Tabs
        >
            <Tabs.Screen
            name="index"
            href="/index"
            >

            </Tabs.Screen>
        </Tabs>
    );
}