import React, { useEffect, useState } from 'react'
import DefaultContainer from '../../components/DefaultContainer'
import { Text, View, Image} from 'react-native'
import CustomButton from '../../components/CustomButton'
import { useDispatch } from 'react-redux';
import { logout } from '../../context/slices/userSlice';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import {useSelector} from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import COLOURS from '../../static/design_constants';
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
    const imageRef = ref(storage, `images/${user.uid}`)
    getDownloadURL(imageRef).then((url) => {
      setProfileImg(url);
      setLoaded(true);
    })
  },[])

  return (
    <View className="w-full h-full flex flex-col items-center">
        <View className="h-[30%] w-full  ">
            <DefaultContainer subheading="Let's view your" heading="Profile!"/>
        </View>
        <View className="h-[70%] w-[90%] flex flex-col justify-start">
          <View className="w-[100%] flex flex-row justify-between items-center">
            <Text className="text-gray-400 font-semibold text-xl">Profile info</Text>
            <FontAwesome name="pencil" size={20} color={COLOURS.BRAND_COLORLIGHT_GREENGRAY} />
          </View>
          
            <View className="rounded-2xl bg-brand-colordark-green flex flex-row h-[35%] w-full justify-around items-center">
              <View className="flex flex-col space-y-2">
                <Text className="text-white text-3xl">Profile Details</Text>
                <Text className="text-white text-sm">Name: {user.name}</Text>
                <Text className="text-white text-sm">Username: {user.username}</Text>
                <Text className="text-white text-sm">Email: {user.email}</Text>
                <Text className="text-white text-sm">Skill level: {user.experience}</Text>

              </View>
              <View className="flex flex-col items-center justify-evenly w-24  h-[100%]">
              {loaded && (
                <Image 
                style={{height:80, width:80, borderRadius:50}}
                source={{uri:profileImg}}
                />
              )}
              <View className="flex flex-row w-[100%] justify-evenly ">
                  <Text className="text-xs text-white">hit perc</Text>
                  <Text className="text-xs text-white">streak</Text>
              </View>
              </View>
            </View>
            <Text className="text-gray-400 font-semibold text-xl mt-2">Settings</Text>
              <Text className="text-2xl ">🚧This area is to be completed🚧</Text>
              <CustomButton text="Logout" onPress={handleLogout} />
        </View>
    </View>
  )
}

