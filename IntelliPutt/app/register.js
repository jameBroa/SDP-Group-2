import { SafeAreaView, Text, View } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from 'firebase/database';
import auth from '../config/authentication';
import db from '../config/database';
import Button from '../components/Button';
import { Picker } from '@react-native-picker/picker';
import { Link } from 'expo-router';
import TextField from '../components/TextField';
import BackButton from '../components/BackButton';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User successfully created
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

            alert('User created, hi ', user.email);
        })
        .catch((error) => {
            // Handle errors
            if (error.code == 'auth/email-already-in-use') {
                alert("Email already in use.");
            } else if (error.code == 'auth/invalid-email') {
                alert("Invalid email.");
            } else if (error.code == 'auth/weak-password') {
                alert("Weak password.");
            } else {
                console.log('Error creating user:', error.message);
                alert('Error creating user:', error.message)
            }
        });   
    };

    return (
        <SafeAreaView className="flex flex-col items-center justify-center h-full">
            <BackButton href="./" />
            <View className="mb-10 items-center">
                <Text className="fixed top-0 left-0 [font-family:'Poppins-Bold',Helvetica] font-bold text-lime-950 text-[32px] tracking-[0] leading-[normal]">
                    Hi!
                </Text>
                <Text className="mt-2 fixed h-[24px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-[#093923] text-[16px] tracking-[0] leading-[normal]">
                    Create an account to get started.
                </Text>
            </View>

            <View className="w-3/4">
                <TextField placeholder="Name" value={name} onChangeText={setName} />
                <TextField placeholder="Email" value={email} onChangeText={setEmail} />
                <TextField placeholder="Password" value={password} onChangeText={setPassword} />

                <Picker
                    selectedValue={experienceLevel}
                    onValueChange={(itemValue) => setExperienceLevel(itemValue)}
                    >
                    <Picker.Item label="Beginner" value="Beginner" />
                    <Picker.Item label="Intermediate" value="Intermediate" />
                    <Picker.Item label="Advanced" value="Advanced" />
                </Picker>
            
                <Button text="Register" onPress={handleRegister} goTo="./home" />
            </View>
            

            
        </SafeAreaView>
    );
}