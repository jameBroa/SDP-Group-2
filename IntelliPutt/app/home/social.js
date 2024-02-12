import React, { useState } from 'react'
import DefaultContainer from '../../components/DefaultContainer'
import Modal from "react-native-modal";
import CustomButton from '../../components/CustomButton';
import TextField from '../../components/TextField';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { collection, getDocs, query, where, arrayUnion, updateDoc, doc } from "firebase/firestore";
import db from '../../config/database';
import { useSelector } from 'react-redux';

export default function Social() {
  const [showModal, setShowModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const currentUser = useSelector((state) => state.user.user);

  const handleAddFriend = async () => {
    const userRef = collection(db, "users");
    console.log('Current user:', currentUser.uid);
    const currentUserRef = doc(db, "users", currentUser.uid);
    const q = query(userRef, where("email", "==", friendEmail.toLowerCase()));
    
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("User doesn't exist, check the email and try again.")
        return;
      } 

      const friendData = querySnapshot.docs[0].data()["uid"];
      // Add friend to user's friends list
      await updateDoc(currentUserRef, {
        friends: arrayUnion(friendData)
      })
      .then(() => {
        alert('Friend added successfully to current user\'s friends list.');
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      })
      .catch(error => {
        console.error('Error updating current user\'s friends list:', error);
      });
      
    } catch (error) {
        console.error('Error fetching friend data:', error.message);
        return {};
    }
  }

  return (
    <View className="w-full h-full flex flex-col">
        <View className="h-[30%]  ">
            <DefaultContainer subheading="Let's view your" heading="Friends!"/>
        </View>
        <View className="h-[70%] w-full flex flex-col justify-center items-center">
            <Text className="text-2xl ">🚧This area is to be completed🚧</Text>
            <CustomButton text="Add friend" onPress={() => setShowModal(true)} />
        </View>

        <Modal isVisible={showModal} animationIn="slideInUp" animationOut="slideOutDown" className="w-full ml-0 mt-[50%] mb-0" style={styles.modal}>
          <ScrollView automaticallyAdjustKeyboardInsets={true} contentContainerStyle={styles.modalWrapper} className="bg-white px-[30px] pt-[20px] pb-[40px] rounded-lg w-full">
            <Pressable className="my-[20px]" onPress={() => setShowModal(false)}>
              <Text className="text-stone-900 text-[16px]"> Cancel </Text>
            </Pressable>
            <View className="mb-10 mt-[50px] pt-[20px] items-center">
              <Text className="[font-family:'Poppins-Bold',Helvetica] font-bold text-lime-950 text-center text-[30px] tracking-[0] leading-[normal]">
                  Add a friend!
              </Text>
              <Text className="font-light m-4 text-base text-center">
                  Enter your friend's email to request to add them as a friend.
              </Text>
            </View>

            <View className="items-center w-[95%] ml-2 mt-10">
              <TextField placeholder="Email" value={friendEmail} onChangeText={setFriendEmail} />
              <CustomButton text="Request" onPress={handleAddFriend}/>
            </View>
          </ScrollView>
        </Modal>
    </View>
  )
}

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