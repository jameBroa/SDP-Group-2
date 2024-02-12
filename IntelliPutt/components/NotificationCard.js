import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import CustomButton from './CustomButton';
import { ScrollView, Text, View, Pressable } from 'react-native';

const NotificationCard = ({isRead, name, email, content, time}) => {
    const [showModal, setShowModal] = useState(false);

    const acceptFriendRequest = () => {
        console.log("Friend request accepted");
        setTimeout(() => {
            setShowModal(false);
        }, 500);
    }

    const ignoreFriendRequest = () => {   
        console.log("Friend request ignored");
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
                        <Text className="py-2">{content}</Text>
                        
                        <View>
                            <Text className="text-stone-700">{time} ago</Text>
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
