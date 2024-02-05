import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../context/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

let persistor = persistStore(store);

export default function Layout() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        gestureEnabled: false
                    }}
                />
            </PersistGate>
        </Provider>
    );
}