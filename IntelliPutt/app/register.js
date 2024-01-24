import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from 'firebase/database';
import auth from '../config/authentication';
import db from '../config/database';
import { TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Link } from 'expo-router';
import COLOURS from '../static/design_constants';

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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                sign up or <Link href="/login" style={{ color: COLOURS.DARK_GREEN, fontWeight: 'bold' }}>log in</Link> to continue.
            </Text>
            <TextInput
                placeholder='Name'
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, padding: 10, margin: 10, width: 200 }}
            />
            <Picker
                selectedValue={experienceLevel}
                onValueChange={(itemValue) => setExperienceLevel(itemValue)}
                style={{ width: 200 }}>
                <Picker.Item label="Beginner" value="Beginner" />
                <Picker.Item label="Intermediate" value="Intermediate" />
                <Picker.Item label="Advanced" value="Advanced" />
            </Picker>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ borderWidth: 1, padding: 10, margin: 10, width: 200 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderWidth: 1, padding: 10, margin: 10, width: 200 }}
            />
            
            <Button title="register" onPress={handleRegister} />
        </View>
    );
}