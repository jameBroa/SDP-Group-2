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
import React, { useRef, useState } from 'react';
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
import EthicsModal from '../components/EthicsModal';
import {Checkbox} from 'expo-checkbox';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view'
import { FontAwesome6 } from '@expo/vector-icons';
import COLOURS from '../static/design_constants';
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
    const [ethicsModalVis, setEthicsModalVis] = useState(false);
    const [streakConsent, setStreakConsent] = useState(true);
    const [dataConsent, setDataConsent] = useState(true);
    const [videoConsent, setVideoConsent] = useState(true);
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
        setEthicsModalVis(false);
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
                    friends: [],
                    streak: streakConsent,
                    data: dataConsent,
                    video: videoConsent
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
                    friends: [],
                    streak: streakConsent,
                    data: dataConsent,
                    video: videoConsent
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

    const scrollViewRef = useRef(null);

    const handleScroll = (e) => {
        const scrollY = e.nativeEvent.contentOffset.y
        const threshold = 50

        if(scrollY < -threshold){
            setEthicsModalVis(false);
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
                    </View>

                    {/* <CustomButton text="Register" onPress={handleRegister}/> */}
                    <CustomButton text="Register" onPress={() => {setEthicsModalVis(true)}}/>
                    <Text className="mb-10 mt-2 text-stone-900 font-medium">
                        Already have an account? <Link className="font-bold" href="./login">Login. </Link>    
                    </Text>
                </View>
                
            </SafeAreaView>

            
            <Modal onBackdropPress={() => {setEthicsModalVis(false)}} isVisible={ethicsModalVis} animationIn="slideInUp" animationOut="slideOutDown" className="w-full  ml-0 mb-0 h-[80%]" style={styles.modal}>
                {/* <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white pb-[40px] rounded-lg w-full" > */}

                    <PagerView ref={(viewPager) => {this.viewPager = viewPager}} style={{flex:1,height:100, width:'100%'}}  initialPAge={0}>
                        <View key="1" className="flex flex-col w-full h-full">
                            <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white pb-[40px] rounded-t-modal w-full" >
                                <View className="flex flex-row w-full h-full justify-center">
                                    <View className="flex flex-col w-10/12 space-y-2 h-full justify-center">
                                        <View className="flex flex-col space-y-4 items-center">
                                            <FontAwesome6 name="user-lock" size={152} color={COLOURS.BRAND_COLORDARK_GREEN} />
                                            <Text className="text-3xl font-semibold">Data and Privacy notice</Text>
                                        </View>
                                        <View className="flex flex-col space-y-3 bg-slate">
                                            <Text className="text-lg">Before you can start using IntelliPutt, it's important you understand the data we process.</Text>

                                            <Text className="text-lg">You will learn what data about you is collected, how it is processed and what you want to opt out of.</Text>
                                        
                                        </View>
                                        <View className="flex flex-col space-y-1 items-center pt-6">
                                            <Pressable onPress={() => {this.viewPager.setPage(1)}} className="h-12 w-64 rounded-xl flex flex-col items-center justify-center bg-brand-colordark-green">
                                                <Text className="text-white font-light text-lg ">Continue</Text>
                                            </Pressable>
                                            <Text className="text-xs italic text-stone-400 ">Or swipe to continue</Text>
                                        </View>
                                        
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View key="2" className="flex flex-col w-full h-full">
                            <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white pb-[40px] rounded-t-modal w-full" >
                                <View className="flex flex-row w-full h-full justify-center">
                                    <View className="flex flex-col w-11/12 space-y-2 h-full justify-center">
                                        <View className="flex flex-col space-y-4 items-center">
                                            <FontAwesome5 name="cloud" size={96} color={COLOURS.BRAND_COLORDARK_GREEN} />
                                            <Text className="text-3xl font-semibold">Data Collection</Text>
                                        </View>
                                        <View className="flex flex-col space-y-1 itesm-center">
                                            <Text className="text-lg">Below you can find the pieces of information we will store about you.</Text>
                                            <Text className="text-lg">{`\u2022`} Name</Text>
                                            <Text className="text-lg">{`\u2022`} Username</Text>
                                            <Text className="text-lg">{`\u2022`} Email</Text>
                                            <Text className="text-lg">{`\u2022`} Experience Level</Text>
                                            <Text className="text-lg">{`\u2022`} Friends List</Text>
                                            <Text className="text-lg">{`\u2022`} Notification Responses</Text>
                                            <Text className="text-lg">{`\u2022`} Streak</Text>
                                            <Text className="text-lg">{`\u2022`} Putting Data</Text>
                                            <Text className="text-lg">{`\u2022`} Video playback</Text>
                                        </View>
                                        <View className="flex flex-col space-y-1 items-center pt-4">
                                            <Pressable onPress={() => {this.viewPager.setPage(1)}} className="h-12 w-48 rounded-xl flex flex-col items-center justify-center bg-brand-colordark-green">
                                                <Text className="text-white font-light text-lg ">Continue</Text>
                                            </Pressable>
                                            <Text className="text-xs italic text-stone-400 ">Or swipe to continue</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        
                        <View key="3" className="flex flex-col w-full h-full">
                            <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white pb-[40px] rounded-t-modal w-full" >
                                <View className="flex flex-row w-full h-full justify-center">
                                    <View className="flex flex-col w-10/12 space-y-2 h-full justify-center">
                                        <View className="flex flex-col space-y-4 items-center">
                                            <FontAwesome5 name="handshake-slash" size={152} color={COLOURS.BRAND_COLORDARK_GREEN} />                                            
                                            <Text className="text-3xl font-semibold">What can I opt out of?</Text>
                                        </View>
                                        <View className="flex flex-col space-y-1">
                                            <Text className="text-lg">The following are optional pieces of information you can opt out of.</Text>
                                            <Text className="text-lg">1) Streak</Text>
                                            <Text className="text-lg">2) Putting Data</Text>
                                            <Text className="text-lg">3) Video Playback</Text>
                                        </View>
                                        <View className="flex flex-col items-center pt-4 space-y-1">
                                            <Pressable onPress={() => {this.viewPager.setPage(3)}} className="h-12 w-48 rounded-xl flex flex-col items-center justify-center bg-brand-colordark-green">
                                                <Text className="text-white font-light text-lg ">Continue</Text>
                                            </Pressable>
                                            <Text className="text-xs italic text-stone-400 ">Or swipe to continue</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View key="4" className="flex flex-col w-full h-full">
                            <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} automaticallyAdjustKeyboardInsets={true} contentContainerStyle={{flexGrow:1, height:'100%'}} className="bg-white pb-[40px] rounded-t-modal w-full" >
                                <View className="flex flex-row w-full h-full  justify-center">
                                    <View className="flex flex-col w-11/12 space-y-10 h-full  items-center justify-center">
                                        {/* <View className="flex flex-row w-full justify-center space-y-4">
                                            <FontAwesome5 name="handshake-slash" size={124} color={COLOURS.BRAND_COLORDARK_GREEN} />                                            
                                        </View> */}
                                        <View className="flex flex-col space-y-7 ">
                                            <View className="flex flex-col space-y-1">
                                                <Text className="text-3xl font-semibold">What is streak?</Text>
                                                <Text className="text-lg">Streak refers to how many days in a row you have used the system. 
                                                This part functionally aims to promote regular use of the device, a key component in improving.</Text>
                                            </View>
                                            <View className="flex flex-col space-y-1">
                                                 <Text className="text-3xl font-semibold">What is putting data?</Text>
                                                <Text className="text-lg">Putting data refers to your putting statistics when using IntelliPutt. This is broken down into three parts </Text>
                                                <Text className="text-lg">1)The date you used the device</Text>
                                                <Text className="text-lg">2)How many attempts you made</Text>
                                                <Text className="text-lg">3)How many attempts were successful</Text>
                                            </View>
                                            
                                           
                                        </View>
                                        <View className="flex flex-col space-y-1 ">
                                            <Pressable onPress={() => {this.viewPager.setPage(4)}} className="h-12 w-48 rounded-xl flex flex-col items-center justify-center bg-brand-colordark-green">
                                                <Text className="text-white font-light text-lg ">Continue</Text>
                                            </Pressable>
                                            <Text className="text-xs italic text-stone-400 ">Or swipe to continue</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View key="5" className="flex flex-col w-full h-full">
                            <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} automaticallyAdjustKeyboardInsets={true} contentContainerStyle={{flexGrow:1, height:'105%'}} className="bg-white pb-[40px] rounded-t-modal w-full" >
                                <View className="flex flex-row w-full h-full justify-center">
                                    <View className="flex flex-col w-11/12 space-y-2 h-[98%] items-center justify-end ">
                                        {/* <View className="flex flex-row justify-center space-y-4">
                                            <FontAwesome5 name="handshake-slash" size={64} color={COLOURS.BRAND_COLORDARK_GREEN} />                                            
                                        </View> */}
                                        <View className="flex flex-col space-y-4 ">
                                            <View className="flex flex-col space-y-1">
                                                <Text className="text-3xl font-semibold">What is video playback?</Text>
                                                <Text className="text-lg">Video playback is a feature which allows you to view footage of your putting session. This means we store the following:</Text>
                                                <Text className="text-lg">1)A video of your swing (you're face is not visible)</Text>
                                                <Text className="text-lg">2)A timestamp associated with the swing</Text>
                                                <Text className="text-lg">3)Whether the putt was successful</Text>
                                            </View>
                                            <View className="flex flex-col space-y-1">
                                                <Text className="text-3xl font-semibold">Is streak not inferred by putting data?</Text>
                                                <Text className="text-lg">While technically inspecting the putting data means you can determine a users streak, 
                                                the storage location of both are separate. To achieve this would require query gymnastics. If you choose to opt out of streak, 
                                                then we will not process your streak under any circumstance.</Text>
                                            </View>

                                            
                                        </View>
                                        <View className="flex flex-col space-y-1  items-center">
                                            <Pressable onPress={() => {this.viewPager.setPage(5)}} className="h-12 w-48 rounded-xl flex flex-col items-center justify-center bg-brand-colordark-green">
                                                <Text className="text-white font-light text-lg ">Continue</Text>
                                            </Pressable>
                                            <Text className="text-xs italic text-stone-400 ">Or swipe to continue</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View key="6" className="flex flex-col w-full h-full">
                            <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} automaticallyAdjustKeyboardInsets={true} contentContainerStyle={{flexGrow:1, height:'105%'}} className="bg-white pb-[40px] rounded-t-modal w-full" >
                                <View className="flex flex-row w-full h-full justify-center">
                                    <View className="flex flex-col w-11/12 space-y-2 h-[98%] items-center justify-center ">
                                        <View className="flex flex-row justify-center space-y-4">
                                            <FontAwesome5 name="handshake-slash" size={124} color={COLOURS.BRAND_COLORDARK_GREEN} />                                            
                                        </View>
                                        <View className="flex flex-col space-y-4 ">
                                            <View className="flex flex-col space-y-1">
                                                <Text className="text-3xl font-semibold">Finally...</Text>
                                                <Text className="text-lg">Before you go on to using IntelliPutt, please indicate your choices below on whether you 
                            allow us to process your data. For full functionality, we reccommend selecting all options.</Text>
                                            </View>
                                            <View className="flex flex-row justify-evenly">
                                                <View className="flex flex-col items-center">
                                                    <Text>Streak Consent</Text>
                                                    <Checkbox style={styles.checkboxStyle} value={streakConsent} onValueChange={setStreakConsent}/>
                                                </View>
                                                <View className="flex flex-col items-center">
                                                    <Text>Data Consent</Text>
                                                    <Checkbox style={styles.checkboxStyle} value={dataConsent} onValueChange={setDataConsent}/>
                                                </View>
                                                <View className="flex flex-col items-center">
                                                    <Text>Video Consent</Text>
                                                    <Checkbox style={styles.checkboxStyle} value={videoConsent} onValueChange={setVideoConsent}/>
                                                </View>
                                            </View>
                                            

                                            
                                        </View>
                                        <View className="flex flex-col space-y-1  items-center">
                                            <Pressable onPress={() => {this.viewPager.setPage(3)}} className="h-12 w-48 rounded-xl flex flex-col items-center justify-center bg-brand-colordark-green">
                                                <Text className="text-white font-light text-lg ">Continue</Text>
                                            </Pressable>
                                            <Text className="text-xs italic text-stone-400 ">Or swipe to continue</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                    </PagerView>
                {/* </ScrollView> */}
                {/* <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white pb-[40px] rounded-lg w-full" >
                    <View className="w-[100%] h-10 top-[-10%]  flex flex-row justify-center">
                            <View className="fixed w-2/5 flex flex-row justify-center">
                                <AntDesign name="arrowup" size={24} color="black" />                            
                            </View>
                    </View>
                    <View className="w-[100%] flex flex-row justify-center">
                        <View className="w-[95%] flex flex-col justify-start">
                            <Text className="text-2xl font-semibold">Data and Privacy notice</Text>
                            <Text className="text-sm">Before you can start using IntelliPutt, it's important you understand the data we process.
                            You will learn what data about you is collected, how it is processed and what you want to opt out of.</Text>
                            <Text className="text-2xl font-semibold">Data collection</Text>
                            <Text className="text-sm">The following are data points that we keep about you. </Text>
                            <Text className="text-sm">{`\u2022`} Name{`\u00b9`}</Text>
                            <Text className="text-sm">{`\u2022`} Username{`\u00b9`}</Text>
                            <Text className="text-sm">{`\u2022`} Email{`\u00b9`}</Text>
                            <Text className="text-sm">{`\u2022`} Experience Level{`\u00b9`}</Text>
                            <Text className="text-sm">{`\u2022`} Friends List{`\u00b9`}</Text>
                            <Text className="text-sm">{`\u2022`} Notification Responses{`\u00b9`}</Text>
                            <Text className="text-sm">{`\u2022`} Streak{`\u00b2`}</Text>
                            <Text className="text-sm">{`\u2022`} Putting Data{`\u00b2`}</Text>
                            <Text className="text-sm">{`\u2022`} Video playback{`\u00b2`}</Text>
                            <Text className="textsm">You'll have noticed that there are two types of data we collect.</Text>
                            <Text className="textsm">1)The data we need for core functionality</Text>
                            <Text className="textsm">2)The type of data you can opt out of.</Text>
                            <Text className="text-2xl font-semibold">What can I opt out of?</Text>
                            <Text className="text-sm">You can opt out of our data retrieval service which tracks your putts, your currrent putting streak and videos of you putting.</Text>
                            <Text className="text-xl font-semibold">What is streak?</Text>
                            <Text className="text-sm">Streak refers to how many days in a row you have used the system. 
                            This part functionally aims to promote regular use of the device, a key component in improving.</Text>
                            <Text className="text-xl font-semibold">What does putting data mean?</Text>
                            <Text className="text-sm">Putting data refers to your putting statistics when using IntelliPutt. This is broken down into three parts </Text>
                            <Text className="textsm">1)The date you used the device</Text>
                            <Text className="textsm">2)How many attempts you made</Text>
                            <Text className="textsm">3)How many attempts were successful</Text>
                            <Text className="text-xl font-semibold">What is video playback?</Text>
                            <Text className="text-sm">Video playback is a feature which allows you to view footage of your putting session. This means we store the following:</Text>
                            <Text className="textsm">1)A video of your swing (you're face is not visible)</Text>
                            <Text className="textsm">2)A timestamp associated with the swing</Text>
                            <Text className="textsm">3)Whether the putt was successful</Text>
                            <Text className="text-sm">We hope that this feature allows you to self-review your technique as part of a video library.</Text>
                            <Text className="text-xl font-semibold">Isn't streak inferred by putting data?</Text>
                            <Text className="text-sm">While technically inspecting the putting data means you can determine a users streak, 
                            the storage location of both are separate. To achieve this would require query gymnastics. If you choose to opt out of streak, 
                            then we will not process your streak under any circumstance.</Text>
                            <Text className="text-2xl font-semibold">And finally...</Text>
                            <Text className="text-sm">Before you go on to using IntelliPutt, please indicate your choices below on whether you 
                            allow us to process your data. For full functionality, we reccommend selecting all options.</Text>
                            <View className="w-full flex flex-row justify-around">
                                <View className="flex flex-col items-center">
                                    <Text>Streak Consent</Text>
                                    <Checkbox style={styles.checkboxStyle} value={streakConsent} onValueChange={setStreakConsent}/>
                                </View>
                                <View className="flex flex-col items-center">
                                    <Text>Data Consent</Text>
                                    <Checkbox style={styles.checkboxStyle} value={dataConsent} onValueChange={setDataConsent}/>
                                </View>
                                <View className="flex flex-col items-center">
                                    <Text>Video Consent</Text>
                                    <Checkbox style={styles.checkboxStyle} value={videoConsent} onValueChange={setVideoConsent}/>
                                </View>
                            </View>

                            <CustomButton onPress={handleRegister} text={"Complete Sign-up"}/>



                        </View>

                    </View>



                </ScrollView> */}
            </Modal>
            

            <Modal isVisible={showModal} animationIn="slideInUp" animationOut="slideOutDown" className="w-full mt-[40%] ml-0 mb-0 h-[90%]" style={styles.modal}>
                <ScrollView automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white px-[30px] pt-[20px] pb-[40px] rounded-lg w-full" >
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
        height: '100%',
    },
    checkboxStyle:{
        margin:8
    }
};