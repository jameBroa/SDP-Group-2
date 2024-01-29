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
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from '../config/firebase';
import CustomButton from '../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../components/TextField';
import BackButton from '../components/BackButton';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User successfully logged in
            const user = userCredential.user;
            setEmail(userCredential.email);
            setPassword(userCredential.password);

            alert('User signed in, hi ', userCredential.user.displayName);
            console.log('User signed in:', user);
        })
        .catch((error) => {
            // Handle errors
            alert('Failed to sign in ', error.message);
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

                    <CustomButton text="Log in" goTo="./home" onPress={handleLogin} /> 
                    <Text className="mb-10">
                        Don't have an account? <Link className="font-bold" href="./register">Register. </Link>    
                    </Text>      
                </View>
            </SafeAreaView>
        </View>
    );
};

