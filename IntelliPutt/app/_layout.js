import { Stack } from 'expo-router';
import COLOURS from '../static/design_constants';

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLOURS.DARK_GREEN,
                },
                headerTintColor: COLOURS.MEDIUM_GREEN,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        />
    );
}