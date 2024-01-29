import { Stack } from 'expo-router';
import COLOURS from '../static/design_constants';

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        />
    );
}