import React, { useState, Fragment, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import CustomButton from './CustomButton';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { collection, query, where, getDoc, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import db from '../config/database';     
import { useSelector } from 'react-redux';           
import COLOURS from '../static/design_constants';
import { Ionicons } from '@expo/vector-icons';
const NotificationCard = ({ id, reqData, userData }) => {

    // State vars
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [isRead, setIsRead] = useState(false);
    const [time, setTime] = useState(new Date((reqData.timestamp.seconds *1000)).toLocaleDateString());
    const [loaded, setLoaded] = useState(false);
    const [friendUID, setFriendUID] = useState(reqData.from);

    // Firebase vars
    const userRef = collection(db, "users");

    //Redux vars
    const currentUser = useSelector((state) => state.user.user);

    const fetchFriend = () => {
        const friendRequestQuery = doc(db, "friendRequests", id);
        const response = getDoc(friendRequestQuery);
        response.then((querySnapshot) => {
            setFriendUID(querySnapshot.data()["from"])
            const individualRequestQ = query(userRef, where("uid", "==", querySnapshot.data()["from"]));
            const individualRequest = getDocs(individualRequestQ);
            individualRequest.then((individualRequestSnapshot) => {
                if (individualRequestSnapshot.empty) {
                    console.log("User has been deleted.");
                    return;
                }
                
                console.log("User exists, fetching data: " + individualRequestSnapshot.docs[0].data());
                const friendData = individualRequestSnapshot.docs[0].data();

                setName(friendData["name"]);
                setEmail(friendData["email"]);
                setIsRead(querySnapshot.data()["status"] == "pending" ? false : true);
                setTime(new Date(querySnapshot.data()["timestamp"]["seconds"] * 1000).toLocaleDateString());
            });
        });
    }

    useEffect(() => {
        if(reqData.status == "accepted"){
            setIsRead(true);
        }
        console.log(new Date((reqData.timestamp.seconds *1000)).toLocaleDateString());

    }, [userData])

    // if (!loaded) {
    //     fetchFriend();
    //     setLoaded(true);
    // }

    const acceptFriendRequest = () => {
        console.log("Friend request accepted");
        updateDoc(doc(db, "friendRequests", id), { status: "accepted" });

        // Add friend to both users' friend list
        updateDoc(doc(db, "users", friendUID), { friends: arrayUnion(currentUser.uid) });
        updateDoc(doc(db, "users", currentUser.uid), { friends: arrayUnion(friendUID) });
        
        setLoaded(false);
        setTimeout(() => {
            setShowModal(false);
        }, 500);
    }

    const ignoreFriendRequest = () => {   
        console.log("Friend request ignored");
        updateDoc(doc(db, "friendRequests", id), { status: "ignored" });
        setLoaded(false);
        setTimeout(() => {
            setShowModal(false);
        }, 500);
    } 

    return (
        <View style={{
            backgroundColor: isRead==false ? COLOURS.BRAND_DEFAULTGRAY : COLOURS.BRAND_DARKGRAY

        }} className="flex-row items-center justify-between rounded-xl mb-2 p-4 bg-stone-100">
            <Pressable onPress={() => setShowModal(true)}>
                <View className="flex-row items-center">
                    <AntDesign name="user" size={30} color="black" />
                    {!isRead && (
                            <View
                                className="h-[5px] w-[5px] bg-red-500 rounded-md absolute top-[15%] right-[99%]"
                            />
                        )
                    }
                    
                    <View className="pl-3">
                        <View className="flex flex-row">
                            <Text className="font-bold text-lime-900 mr-1">{name}</Text>
                            {isRead && reqData.status == "accepted" && (

                                <View className="top-[-20%] flex flex-row">                            
                                    <Ionicons name="checkmark-outline" size={24} color="#A3FFA1" />
                                </View>
                            )}
                            {isRead && reqData.status == "ignored" && (

                            <View className="top-[-20%] flex flex-row">                            
                                <Ionicons name="close-outline" size={24} color="#ffa3a1" />                            
                            </View>
                            )}

                        </View>
                        <Text className="py-2">
                        <Fragment>
                            <Text className="text-stone-600">
                                sent you a friend request
                            </Text>
                        </Fragment>
                        </Text>
                        
                        <View>
                            <Text className="text-stone-700">{time}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
            {!isRead && (
            <Modal isVisible={showModal} animationIn="slideInUp" animationOut="slideOutDown" className="w-full ml-0 mt-[50%] mb-0" style={styles.modal}>
                <ScrollView automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white px-[30px] rounded-lg w-full">
                    <Pressable style={{backgroundColor:COLOURS.BRAND_DEFAULTGRAY}} className="my-[20px] rounded-lg w-16 h-8 flex items-center justify-center " onPress={() => setShowModal(false)}>
                        <Text  className="text-stone-900 text-[16px]"> Cancel </Text>
                    </Pressable>
                    <View className="w-full flex flex-col h-[80%] justify-evenly items-center ">
                        <AntDesign name="user" size={192} color="black" />

                        <Text className="[font-family:'Poppins-Bold',Helvetica] font-bold text-lime-950 text-center text-[30px] tracking-[0] leading-[normal]">
                            {name} has sent you a friend request!
                        </Text>
                        <Text className="font-light  m-4 text-base text-center">
                            Do you recognise <Text className="underline text-xl">{email}</Text>?
                        </Text>
                            <View className="items-center w-fit">
                                <CustomButton text="Accept" onPress={acceptFriendRequest}/>
                                <CustomButton text="Ignore" onPress={ignoreFriendRequest}/>
                            </View>
                        </View>
                    
                </ScrollView>
            </Modal>
            )}
        </View>
    );
};

const styles = {
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalWrapper: {
        flexGrow: 1,
        height: '50%',
    }
}

export default NotificationCard;
