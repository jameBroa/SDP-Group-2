import React, { useEffect, useState } from 'react'
import DefaultContainer from '../../components/DefaultContainer'
import { Text, View, Image} from 'react-native'
import CustomButton from '../../components/CustomButton'
import { useDispatch } from 'react-redux';
import { logout } from '../../context/slices/userSlice';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import {useSelector} from 'react-redux';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import COLOURS from '../../static/design_constants';
import { ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import ProfileTab from '../../components/ProfileTab';

export default function Profile() {
  // Redux var
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log('Logging out');
    dispatch(logout());
  }

  // State variables
  const [profileImg, setProfileImg] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storage = getStorage()
    const imageRef = ref(storage, `images/${user.uid}.png`)
    getDownloadURL(imageRef).then((url) => {
      setProfileImg(url);
    }).catch((error) => {
      console.log(error);
    });
  },[])

  return (
    <View className="w-full h-full flex flex-col items-center bg-brand-colordark-green">
        <Stack.Screen options={{headerShown:false}}></Stack.Screen>
        <View className="h-[40%] w-full items-center justify-center ">
          <Image 
            style={{height:110, width:110, borderRadius:50, marginTop:50, marginBottom:8}}
            source={
              profileImg == null ? require('../../static/images/user_placeholder.jpeg') : { 
              uri: profileImg 
            }}
          />
            
          <Text className="text-2xl font-medium mt-2 text-stone-50">{user.name}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.wrapper} className="h-[60%] w-full flex flex-col rounded-t-3xl px-[4%] bg-stone-100 pt-5">
          <View className="my-2 flex flex-row w-[100%] justify-evenly">
            <ProfileTab icon="golf" text="67%" />
            <ProfileTab icon="streak" text="2 days" />
            <ProfileTab icon="friends" text="2 friends" />
          </View>
          <View className="h-[22%] justify-evenly items-start flex flex-row mt-2">
            <View className="bg-brand-colordark-green w-[46.5%] h-full justify-center items-center rounded-xl">
              <Entypo name="folder-video" size={45} color="white" />
            </View>
            <View className="bg-brand-colordark-green w-[46.5%] h-full  justify-center items-center rounded-xl">
              <Entypo name="open-book" size={45} color="white" />
            </View>
          </View>
          
          <View className="mb-[18%]">
            
          </View>
          <CustomButton text="Edit your profile" onPress={handleLogout} />
          <CustomButton text="Privacy settings" onPress={handleLogout} />
          <CustomButton text="Logout" onPress={handleLogout} />
        </ScrollView>
    </View>
  )
}

const styles = {
  wrapper: {
    justifyContent: 'start'
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