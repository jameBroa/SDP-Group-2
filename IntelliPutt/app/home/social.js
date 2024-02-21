import React, { useState } from 'react'
import DefaultContainer from '../../components/DefaultContainer'
import Modal from "react-native-modal";
import CustomButton from '../../components/CustomButton';
import TextField from '../../components/TextField';
import { ScrollView, Text, View, Pressable, RefreshControl } from 'react-native';
import { collection, getDocs, query, where, serverTimestamp, addDoc, or } from "firebase/firestore";
import db from '../../config/database';
import { useSelector } from 'react-redux';
import FriendCard from '../../components/FriendCard';
import { AntDesign } from '@expo/vector-icons';
import { getDoc, doc } from 'firebase/firestore';
import ReduxStateUpdater from '../../context/util/updateState';

export default function Social() {
  // redux
  const user = useSelector((state) => state.user.user);

  // state management
  const [showModal, setShowModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const updateFriends = () => {
    // compare against friends in state
    console.log("Friends in state: " + user["friends"]);
    user["friends"].forEach(friendUID => {
        console.log("Friend uid: ", friendUID);

        getDoc(doc(db, "users", friendUID))
            .then((d) => {
                console.log("Friend data: ", d.data());
                
                const friendData = {
                    name: d.data()["name"],
                    email: d.data()["email"],
                    username: d.data()["username"],
                    skill: d.data()["experienceLevel"],
                    uid: d.data()["uid"]
                };

                if (!friends.includes(friendData)) {
                    setFriends([...friends, friendData]);
                }
            })
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    ReduxStateUpdater.fetchFriends();
    updateFriends();
    setTimeout(() => setRefreshing(false), 1000);
  }, [])

  const handleAddFriend = async () => {
    const userRef = collection(db, "users");
    const friendRef = collection(db, "friendRequests");
    const q = query(userRef, or (
      where('email', '==', friendEmail.toLowerCase()), where('username', '==', friendEmail.toLowerCase())
    ));
    
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("User doesn't exist, check the email and try again.")
        return;
      } 

      const friendData = querySnapshot.docs[0].data()["uid"];
      // Add friend request
      addDoc(friendRef, 
          {
              to: friendData,
              from: currentUser.uid,
              status: 'pending',
              timestamp: serverTimestamp()
          }
      )
      .then(() => {
        alert('Friend request sent!');
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      })
      .catch(error => {
        console.error('Error sending request: ', error);
      });
      
    } catch (error) {
        console.error('Error fetching friend data:', error.message);
        return {};
    }
  }

  // handles first render of page
  if (!loaded) {
    setLoaded(true);
    updateFriends();
  };

  return (
    <View className="w-full h-full flex flex-col">
        <View className="h-[30%]">
            <DefaultContainer subheading="Let's view your" heading="Friends!"/>
        </View>
        <ScrollView contentContainerStyle={styles.wrapper} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <View className="h-full w-full flex-col pt-3">
            <View className="items-end mr-5 mb-2">
              <Pressable 
                onPress={() => setShowModal(true)}
                >
                <AntDesign name="plus" size={24} color="black" />
              </Pressable>
            </View>
            <View className="w-full h-full">
              {friends.map((friend) => { 
                return <FriendCard key={friend.uid} friend={friend} />
              })}
            </View>
          </View>
        </ScrollView>

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
  },
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
  }
};