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

import { SafeAreaView, Text, View, Image, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; 
import auth from '../config/authentication';
import db from '../config/database';
import CustomButton from '../components/CustomButton';
import Chip from '../components/Chip';
import { Link, router } from 'expo-router';
import TextField from '../components/TextField';
import BackButton from '../components/BackButton';
import Modal from "react-native-modal";
import { useDispatch } from 'react-redux';
import { login } from '../context/slices/userSlice';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const tabs = ["Beginner", "Intermediate", "Advanced"];
    const [experienceLevel, setExperienceLevel] = useState(tabs[0]);

    const dispatch = useDispatch();

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {                         // User successfully created            
            const user = userCredential.user;
            setEmail(userCredential.email);
            setPassword(userCredential.password);

            console.log('User created');

            setDoc(doc(db, "users", user.uid), 
                {
                    uid: user.uid,
                    email: email,
                    name: name,
                    experienceLevel: experienceLevel,
                    friends: []
                }
            );
            console.log('Additional data stored in Firestore successfully');

            dispatch(login(
                {
                    uid: user.uid,
                    email: email,
                    name: name,
                    experience: experienceLevel,
                    friends: []
                }
            ));

            alert("Account created. Hi " + name + "! Welcome to IntelliPutt.");
            router.push('/home');
        })
        .catch((error) => {                                 // User creation failed
            alert('Error creating user: ' + error.message)
        });   
    };

    return (
        <View className="max-h-full ">
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
                        <Pressable className="font-bold" onPress={() => setShowModal(true)}> 
                            <Text className="font-bold"> What's this? </Text>
                        </Pressable>  
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
            <Modal isVisible={showModal} animationIn="slideInUp" animationOut="slideOutDown" className="w-full mt-[40%] ml-0 mb-0 h-[90%]" style={styles.modal}>
                <ScrollView automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white px-[30px] pt-[20px] pb-[40px] rounded-lg w-full">
                    <Pressable className="w-[40px] h-[50px] my-[10px] mt-[15px] pt-1 border-solid rounded-full justify-center" onPress={() => setShowModal(false)}>
                        <Text className="h-full border-double text-stone-700 rounded-full text-[25px] font-bold px-2"> &lt; </Text>
                    </Pressable>
                    <Text className="[font-family:'Poppins-Bold',Helvetica] font-bold text-lime-900 text-[30px] tracking-[0] leading-[normal] mt-[20px] absolute left-[30%]">
                        Skill Levels
                    </Text>
                    <View className="mt-[20px] my-4">
                        <View className="mt-4 p-4 rounded-lg bg-stone-50">
                            <Text className="[font-family:'Poppins-Bold',Helvetica] font-bold text-lime-900 text-xl tracking-[0] leading-[normal]">
                                Beginner
                            </Text>
                            <Text className="m-2 text-base">
                                As a beginner, you may struggle with consistent alignment, stance, and grip. 
                            </Text>
                            <Text className="m-2 mt-1 text-base">  
                                Beginners may have difficulty controlling the distance of their putts, leading to inconsistent results in terms of speed and lag putting.
                            </Text>
                        </View>
                        
                        <View className="mt-4 p-4 rounded-lg bg-stone-50">
                            <Text className="[font-family:'Poppins-Bold',Helvetica] font-bold text-lime-900 text-xl tracking-[0] leading-[normal]">
                                Intermediate
                            </Text>
                            <Text className="m-2 text-base">
                                As an intermediate putter, you may have a more refined putting stroke, with improved alignment, stance, and grip. 
                            </Text>
                            <Text className="m-2 mt-1 text-base">
                                Your consistent technique may reduce the number of missed putts due to stroke errors.
                            </Text>
                        </View>

                        <View className="mt-4 p-4 rounded-lg bg-stone-50">
                            <Text className="[font-family:'Poppins-Bold',Helvetica] font-bold text-lime-900 text-xl tracking-[0] leading-[normal]">
                                Advanced
                            </Text>
                            <Text className="m-2 text-base">
                                As an advanced putter, you may have highly refined putting mechanics. 
                            </Text>
                            <Text className="m-2 mt-1 text-base">
                                Your stroke is consistent, and you may use advanced techniques such as a particular grip or putting style.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
}

const styles = {
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    modalWrapper: {
        flexGrow: 1,
        height: '90%',
    }
};