import React, { useState, Fragment } from 'react';
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import CustomButton from './CustomButton';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { collection, query, where, getDoc, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import db from '../config/database';     
import { useSelector } from 'react-redux';           

const NotificationCard = ({ id }) => {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isRead, setIsRead] = useState(false);
    const [time, setTime] = useState("");
    const [loaded, setLoaded] = useState(false);

    const userRef = collection(db, "users");
    const currentUser = useSelector((state) => state.user.user);
    const [friendUID, setFriendUID] = useState("");

    if (!loaded) {
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
                setTime(new Date(data["timestamp"]["seconds"] * 1000).toLocaleDateString());
            });
        });
        setLoaded(true);
    }

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
        <View className="flex-row items-center justify-between rounded-xl mb-2 p-4 bg-stone-100">
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
                        <Text className="font-bold text-lime-900 mr-1">{name} </Text>
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
            
            <Modal isVisible={showModal} animationIn="slideInUp" animationOut="slideOutDown" className="w-full ml-0 mt-[50%] mb-0" style={styles.modal}>
                <ScrollView automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white px-[30px] pt-[20px] pb-[40px] rounded-lg w-full">
                    <Pressable className="my-[20px]" onPress={() => setShowModal(false)}>
                    <Text className="text-stone-900 text-[16px]"> Cancel </Text>
                    </Pressable>
                    <View className="mb-10 mt-[50px] pt-[20px] items-center">
                    <Text className="[font-family:'Poppins-Bold',Helvetica] font-bold text-lime-950 text-center text-[30px] tracking-[0] leading-[normal]">
                        {name} has sent you a friend request!
                    </Text>
                    <Text className="font-light m-4 text-base text-center">
                        Do you recognise <Text className="underline">{email}</Text>?
                    </Text>
                    </View>

                    <View className="items-center w-[95%] ml-2 mt-10">
                        <CustomButton text="Accept" onPress={acceptFriendRequest}/>
                        <CustomButton text="Ignore" onPress={ignoreFriendRequest}/>
                    </View>
                </ScrollView>
            </Modal>
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
