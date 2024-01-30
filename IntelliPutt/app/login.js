{/* 
    LOGIN PAGE
    Authenticates user.

    Input fields
        - Email
        - Password  

    Links to
        - Index page
        - Register page
        - Forgot password page
        - Home page (if successfully authenticated)
*/}

import { ImageBackground, Text, View } from 'react-native';
import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import CustomButton from '../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../components/TextField';
import BackButton from '../components/BackButton';
import db from '../config/database';
import { ref, get } from 'firebase/database';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logInSuccessful, setLogInSuccessful] = useState(false);
   
    // Function to fetch user data from the database
    const fetchUserData = async (userId) => {
        const userRef = ref(db, `users/${userId}`);

        try {
            const snapshot = await get(userRef);
            console.log('User data:', snapshot.val());
            if (snapshot.exists()) {
                // Data found, set it in the state 
                return snapshot.val();
            } else {
                // Data not found
                console.log('No data found for the user with ID:', userId);
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    const auth = getAuth();
    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        // User successfully signed in
        .then((userCredential) => {
            const user = userCredential.user;

            // Get rest of user data from the database
            fetchUserData(user.uid)
            .then((userData) => {
                // Data exists
                console.log('User data:', userData.name);
                alert('User signed in, hi ' + userData.name + '!');
            }).catch((error) => {
                // Data doesn't exist, old account?
                if (error.message == "Cannot read property 'name' of undefined") {
                    alert('User signed in, please update your user details!');
                } else {
                    console.error('Error fetching user data:', error.message); 
                }
            });

            setLogInSuccessful(true);
            console.log('User signed in:' + user.uid);
        })
        // Error with authentication
        .catch((error) => {
            setLogInSuccessful(false);

            if (error.message == 'auth/invalid-credential') {
                alert("Invalid credentials.");
            } else {
                alert('Failed to sign in, try again later.');
                console.error('Error signing in:', error.message);
            }
        });   
    };

    return (
        <View className="bg-white flex-1 flex-col">
            <ImageBackground
                resizeMode="cover"
                source={require('../static/images/background.png')}
                className="flex-1">
                <BackButton href="./" />
            </ImageBackground>
            <SafeAreaView className="bg-stone-50 items-center justify-center flex-1/2 rounded-lg">
                <View className="mb-10">
                    <Text className="fixed top-0 left-0 [font-family:'Poppins-Bold',Helvetica] font-bold text-lime-950 text-[32px] tracking-[0] leading-[normal]">
                        Welcome back!
                    </Text>
                    <Text className="mt-2 fixed h-[24px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-[#093923] text-[16px] tracking-[0] leading-[normal]">
                        We're happy to see you again.
                    </Text>
                </View>
                
                <View className="w-3/4 gap-[12px] px-[12px] py-[10px] rounded">
                    <TextField placeholder="Email" value={email} onChangeText={setEmail} />
                    <TextField placeholder="Password" value={password} onChangeText={setPassword} />
        
                    <Text className="mb-8">
                        <Link className="font-bold" href="./register"> Forgot your password? </Link>    
                    </Text> 

                    <CustomButton text="Log in" goTo={logInSuccessful ? "./home" : "./login"} onPress={handleLogin} /> 
                    <Text className="mb-10">
                        Don't have an account? <Link className="font-bold" href="./register">Register. </Link>    
                    </Text>      
                </View>
            </SafeAreaView>
        </View>
    );
};

