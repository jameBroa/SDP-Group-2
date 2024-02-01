{/* 
    REGISTER PAGE
    Creates a new user account.

    Input fields
        - Name
        - Email
        - Password  
        - Skill level

    Links to
        - Index page
        - Login page
        - Home page (if account successfully created)
        - What's this? (skill level) (missing)
*/}

import { SafeAreaView, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from 'firebase/database';
import auth from '../config/authentication';
import db from '../config/database';
import CustomButton from '../components/CustomButton';
import Chip from '../components/Chip';
import { Link, router } from 'expo-router';
import TextField from '../components/TextField';
import BackButton from '../components/BackButton';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const tabs = ["Beginner", "Intermediate", "Advanced"];
    const [experienceLevel, setExperienceLevel] = useState(tabs[0]);

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {                         // User successfully created            
            const user = userCredential.user;
            setEmail(userCredential.email);
            setPassword(userCredential.password);

            console.log('User created');

            // Store additional user data in Firestore
            const usersRef = ref(db, `users/${user.uid}`);
            set(usersRef, {
                uid: user.uid,
                name: name,
                experienceLevel: experienceLevel
            });
            console.log('Additional data stored successfully');

            router.push('/home');
            alert("Account created. Hi " + name + "! Welcome to IntelliPutt.");
        })
        .catch((error) => {                                 // User creation failed
            alert('Error creating user: ' + error.message)
        });   
    };

    return (
        <SafeAreaView className="bg-stone-100 flex flex-col items-center justify-center h-full">
            <BackButton href="./" />
            <Image
                style={{ width: 50, height: 50 }}
                source={require('../static/images/logo_transparent.png')}
                className="absolute top-[50px] right-[50px]"
            />
            
            <View className="mb-10 items-center">
                <Text className="fixed top-0 left-0 [font-family:'Poppins-Bold',Helvetica] font-bold text-lime-950 text-[32px] tracking-[0] leading-[normal]">
                    Hi!
                </Text>
                <Text className="mt-2 fixed h-[24px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-[#093923] text-[16px] tracking-[0] leading-[normal]">
                    Create an account to get started.
                </Text>
            </View>

            <View className="w-4/5">
                <TextField placeholder="Name" value={name} onChangeText={setName} />
                <TextField placeholder="Email" value={email} onChangeText={setEmail} />
                <TextField placeholder="Password" value={password} onChangeText={setPassword} />
                
                <View className="flex-row mt-5 pt-4 my-4 justify-between">
                    <Text className="font-bold"> Skill level: </Text>
                    <Link className="font-bold" href="./register"> What's this? </Link>
                </View>
                
                <View className="flex-row flex items-center flex-wrap gap-2 justify-center mb-5">
                    {tabs.map((tab) => (
                        <Chip
                            text={tab}
                            selected={experienceLevel === tab}
                            setSelected={setExperienceLevel}
                            key={tab}
                        />
                    ))}
                </View>

                <CustomButton text="Register" onPress={handleRegister}/>
                <Text className="mb-10 mt-2 text-stone-900 font-medium">
                    Already have an account? <Link className="font-bold" href="./login">Login. </Link>    
                </Text>
            </View>

        </SafeAreaView>
    );
}