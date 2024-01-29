import { ImageBackground, Text, View, StyleSheet } from 'react-native';
import { Link, Redirect } from 'expo-router';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from '../config/firebase';
import { TextInput } from 'react-native';
import Button from '../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

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
                <Link href="./index" style={ styles.button } >
                    <Text style={ styles.text }>  &lt;</Text>
                </Link>
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
                    <TextInput
                        className="bg-lime-950 w-full rounded-lg border-2 border-lime-950 p-4 text-stone-50 text-base"
                        placeholderTextColor="#f5f5f4"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}  
                    />
                    <TextInput
                        className="bg-lime-950 w-full rounded-lg border-2 border-lime-950 p-4 text-stone-50 text-base"
                        placeholderTextColor="#f5f5f4"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}  
                        style="font-size: 20px"
                    />
                    <Text className="mb-8">
                        <Link className="font-bold" href="./register"> Forgot your password? </Link>    
                    </Text> 

                    <Button text="Log in" goTo="./home" onPress={handleLogin} /> 
                    <Text className="mb-10">
                        Don't have an account? <Link className="font-bold" href="./register"> Register. </Link>    
                    </Text>      
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    button:{
      width:45,
      height:45,
      backgroundColor:'white',
      alignItems:'center',
      justifyContent:'center',
      overflow:'hidden',
      borderRadius:20,
      position:'absolute',
      left:40,
      top:40
    },
    text:{
      fontSize:32,
      color:'black',
      lineHeight:42,
    }
  });