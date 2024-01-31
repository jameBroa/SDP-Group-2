{/* 
    Configures the authentication for the app.
*/}

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import app from './firebase';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default auth;
