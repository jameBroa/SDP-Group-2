import React, { useEffect, useState } from 'react'
import { Text, View, Image} from 'react-native'
import { useDispatch } from 'react-redux';
import { logout } from '../../context/slices/userSlice';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import {useSelector} from 'react-redux';
import { Stack, router, Link } from 'expo-router';
import { ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import ProfileTab from '../../components/ProfileTab';

export default function Privacy() {
  // Redux var
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [streakConsent, setStreakConsent] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const [videoConsent, setVideoConsent] = useState(false);

  const handleLogout = () => {
    console.log('Logging out');
    dispatch(logout());
  }

  const handlePrivacyChanges = async () => {    
    setDoc(doc(db, "users", user.uid), 
        {
            uid: user.uid,
            email: user.email,
            name: user.name,
            username: user.username.toLowerCase(),
            experienceLevel: user.experienceLevel,
            friends: user.friends,
            streak: streakConsent,
            data: dataConsent,
            video: videoConsent
        }
    );
    
    dispatch(login(
        {
            uid: user.uid,
            email: email,
            name: name,
            username: username,
            experience: experienceLevel,
            friends: user.friends,
            streak: streakConsent,
            data: dataConsent,
            video: videoConsent
        }
    ));
    
    alert("Profile updated successfully!");
};

  if (user) {
    return (
        <View className="w-full h-full flex flex-col items-center bg-brand-colordark-green">
        <Stack.Screen options={{headerShown:false}}></Stack.Screen>
        <View className="h-[30%] w-full items-center justify-center mb-4">
            <BackButton className="h-[5%]" action={() => router.replace("/home/profile")} />
            <View className="flex-row justify-end items-center mb-10 absolute left-[10%] top-[80%]">
                <View className="flex-row mb-2">
                    <Text className="font-semibold text-3xl text-stone-50">Watch your videos</Text>
                </View>
            </View>
        </View>
        <ScrollView contentContainerStyle={styles.wrapper} className="h-[60%] w-full flex flex-col rounded-t-3xl px-[4%] bg-stone-100 pt-5"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
            <View style={styles.container} className="h-full my-2 py-2">
                <View
                    className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-4 mx-3 mb-3">
                    
                    <Link href={{
                        pathname: "/home/playbackAllTime",
                    }}>
                        <Text className="text-base text-brand-colordark-green font-semibold">View all</Text>
                    </Link>
                </View>

                
                <Text className="text-lg text-gray-400 pl-4 pt-3 font-medium mt-1 mb-2">Per session</Text>
                {Array
                .from(sessionID.entries())
                .sort((a, b) => new Date(b[1].split('/').reverse().join('-')) - new Date(a[1].split('/').reverse().join('-')))
                .map(([id, started]) => (
                    <View key={id} 
                        className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-5 mx-3 mb-3">
                        <Text className="text-base text-brand-colordark-green font-semibold">Session on {started}</Text>
                        <Text className="text-base text-brand-colordark-green font-light mb-1">{id}</Text>
                        
                        <Link href={{
                            pathname: "/home/playbackBySession",
                            params: { session: id, date: started },
                        }}>
                            <Text className="text-brand-colordark-green font-semibold">View videos</Text>
                        </Link>
                    </View>
                ))}
                {sessionID.size === 0 && 
                <View 
                className="items-center justify-evenlyh-full bg-stone-200 rounded-2xl py-5 mx-3">
                    <Text>No sessions with videos found</Text>
                </View>
                }
            </View>
          </ScrollView>

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
                                            <Pressable onPress={() => {handleRegister()}} className="h-12 w-48 rounded-xl flex flex-col items-center justify-center bg-brand-colordark-green">
                                                <Text className="text-white font-light text-lg ">Continue</Text>
                                            </Pressable>
                                            <Text className="text-xs italic text-stone-400 ">Or swipe to continue</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                    </PagerView>
            </Modal>
      </View>
      
    )
  }
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