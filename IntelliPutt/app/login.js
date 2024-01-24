import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from '../config/firebase';
import { TextInput, Button } from 'react-native';
import { Link } from 'expo-router';
import COLOURS from '../static/design_constants';

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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                sign in or <Link href="/register" style={{ color: COLOURS.DARK_GREEN, fontWeight: 'bold' }}>register</Link> to continue.
            </Text>
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
            
            <Button title="log in" onPress={handleLogin} />
        </View>
    );
}