{
  /* 
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
        - What's this? (skill level)
*/}

import { SafeAreaView, Text, View, Image, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, query, where, collection, getDocs } from "firebase/firestore"; 
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
import * as ImagePicker from 'expo-image-picker';
import { getStorage, uploadBytes } from 'firebase/storage';
import {ref as refStorage} from 'firebase/storage';

export default function Register() {

    // Data vars
    const tabs = ["Beginner", "Intermediate", "Advanced"];

    // State vars
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [experienceLevel, setExperienceLevel] = useState(tabs[0]);
    const [profileImg, setProfileImg] = useState();
    //Redux Vars
    const dispatch = useDispatch();

    //Functions

    // input is the uid of the user, which is also the image name
    async function _uploadProfileImg(uid){
        const storage = getStorage();
        
        const response = await fetch(profileImg)
        const blob = await response.blob()
        const imageRef = refStorage(storage, `images/${uid}`)
        uploadBytes(imageRef, blob).then((snapshot) => {
            console.log('image uploaded???')
        })
        // const blob = await new Promise((resolve, reject) => {
        //     const xhr = new XMLHttpRequest();
        //     xhr.onload = function () {
        //       resolve(xhr.response);
        //     };
        //     xhr.onerror = function (e) {
        //       console.log(e);
        //       reject(new TypeError("Network request failed"));
        //     };
        //     xhr.responseType = "blob";
        //     xhr.open("GET", profileImg, true);
        //     xhr.send(null);
        //   });
        
        //   const fileRef = ref(getStorage(), uid);
        //   const result = await uploadBytes(fileRef, blob);
        
        //   // We're done with the blob, close and release it
        //   blob.close();

    }

    const handleRegister = () => {
        // Does username already exist
        const userRef = collection(db, "users");
        const q = query(userRef, where('username', '==', username.toLowerCase()));
        const querySnapshot = getDocs(q);
        querySnapshot.then((querySnapshot) => {
            if (!querySnapshot.empty) {
                alert("Username already exists. Please choose another one.");
                return;
            }
        });

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {                         // User successfully created            
            const user = userCredential.user;
            setEmail(userCredential.email);
            setPassword(userCredential.password);
            _uploadProfileImg(user.uid);
            console.log('User created');
            // if not, store user data in Firestore
            setDoc(doc(db, "users", user.uid), 
                {
                    uid: user.uid,
                    email: email,
                    name: name,
                    username: username.toLowerCase(),
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
                    username: username,
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

    const pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })
        if(!result.canceled){
            setProfileImg(result.assets[0].uri);
        }
    }

    return (
        <View className="max-h-full ">
            <SafeAreaView className="bg-stone-100 flex flex-col space-y-2 items-center justify-start h-full">

                <View className="flex flex-row w-[90%] h-[50px] justify-between ">
                    {/* <BackButton href="./" /> */}
                    
                    <Pressable onPress={() => {router.replace("./")}} className="w-14 h-[100%] bg-white rounded-2xl flex flex-row justify-center items-center">
                        <Text>Back</Text>
                    </Pressable>
                    <Image
                        style={{ width: 50, height: 50 }}
                        source={require('../static/images/logo_transparent.png')}
                    />
                </View>
                <View className="flex flex-col items-center  w-4/5">
                    <Text className="fixed top-0 left-0 [font-family:'Poppins-Bold',Helvetica] font-bold text-lime-950 text-[32px] tracking-[0] leading-[normal]">
                        Hi!
                    </Text>
                    <Text className="fixed h-[24px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-[#093923] text-[16px] tracking-[0] leading-[normal]">
                        Create an account to get started.
                    </Text>
                </View>

                <View className="w-4/5 flex flex-col ">
                    <TextField placeholder="Name" value={name} onChangeText={setName}/>
                    <TextField placeholder="Username" value={username} onChangeText={setUsername} />
                    <TextField placeholder="Email" value={email} onChangeText={setEmail} />
                    <TextField placeholder="Password" value={password} onChangeText={setPassword} />
                    
                    <View className="flex-row justify-between pt-4 pb-1 ">
                        <Text className="font-bold"> Skill level: </Text>
                        <Pressable className="font-bold" onPress={() => setShowModal(true)}> 
                            <Text className="font-bold"> What's this? </Text>
                        </Pressable>  
                    </View>

                    <View className="flex flex-row justify-between items-center space-x-4 mb-4 ">
                        {tabs.map((tab) => (
                            <Chip
                                text={tab}
                                selected={experienceLevel === tab}
                                setSelected={setExperienceLevel}
                                key={tab}
                            />
                        ))}
                    </View>

                    <View className="w-full h-20 flex flex-row justify-between mb-4 ">
                        <View className="w-20 bg-stone-400 rounded-xl h-[100%] flex flex-row justify-center items-center ">
                            {/* <Text>no photo :(</Text> */}
                            {profileImg &&(
                                <Image source={{uri: profileImg}} style={{width:80, height:80, borderRadius:10}}/>
                            )}
                        </View>
                        <View className="w-[65%] h-[100%]  flex flex-col justify-between">
                            <Text className="text-xl">Select a profile picture</Text>
                            <Pressable onPress={pickImage} className="w-[100%] h-[50%] rounded-lg bg-brand-colordark-green flex flex-row items-center justify-center">
                                <Text className="text-stone-50">Upload now!</Text>
                            </Pressable>
                        </View>


                            {/* <Pressable onPress={pickImage} className="w-[30%] h-[100%] bg-red-200 rounded-xl flex flex-row justify-center items-center">
                                <Text>Select profile photo</Text>
                            </Pressable> */}
                            {/* {profileImg && (
                                <Image source={{uri: profileImg}} style={{width:100, height:100}}/>
                            )} */}
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