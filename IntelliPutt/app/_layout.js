import { Stack, Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../context/store';

export default function Layout() {
    return (
        <Provider store={store}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            {/* potentially replace header with tabs and manually code in header?
            but then we have the problem of the animation between pages looking dodgy */}
        </Provider>
    );
}