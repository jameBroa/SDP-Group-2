import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import DefaultContainer from '../../components/DefaultContainer'
import { LineGraph } from 'react-native-graph'
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSelector} from 'react-redux';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
  
export default function stats() {
  // Redux vars
  const currUser = useSelector((state) => state.user.user);

  if (currUser == null) {
    return <Redirect to="/app/" />
  }

  // Test data for Linegraph
  const POINTS = [
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 0),
      value: 1,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 1),
      value: 5,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 2),
      value: 10,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 3),
      value: 3,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 4),
      value: 10,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 5),
      value: 6,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 6),
      value: 0,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 7),
      value: 35,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 8),
      value: 19,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 9),
      value: 0,
    },
  ]

  const POINTS2 = [
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 9),
      value: 0,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 8),
      value: 5,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 7),
      value: 9,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 6),
      value: 3,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 5),
      value: 13,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 4),
      value: 14,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 3),
      value: 8,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 2),
      value: 22,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 1),
      value: 21,
    },
    {
      date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 0),
      value: 12,
    },
  ]

  // State management vars
  const [graphdata, setgraphdata] = useState(POINTS)
  const [activeButton, setActiveButton] = useState("W1")
  const [userData, setUserData] = useState(null);

  // Firebase vars
  const userCollectionRef = collection(firestore, "users");
  const userDataCollectionRef = collection(firestore, "users/" + currUser.uid + "/data");

  useEffect(() => {
    const getUserData = async() => {
      try{
        const q = query(userDataCollectionRef);
        const response = await getDocs(q);
        let puttingData = [];
        response.docs.map((doc) => {
          console.log(doc.data());
          puttingData.push(doc.data());
        })
        console.log(puttingData);
        setUserData(puttingData);
      } catch(error) {
        console.log(error)
      }
    }
    getUserData();
  }, [currUser]);


  const changeGraph1 = useCallback(() => {
      setgraphdata(POINTS)
  }, [setgraphdata])

  const changeGraph2 = useCallback(() => {
    setgraphdata(POINTS2)
    setActiveButton("W2")

  }, [setgraphdata])

  const [percentage, setPerc] = useState("36.4")
  return (
    <View className="w-full h-full flex flex-col">
        <View className="h-[30%] ">
            <DefaultContainer subheading="Let's view your" heading="Statistics!"/>
        </View>
        <View className=" h-[70%] w-full flex flex-col">
            <Text className="text-xl text-gray-400 pl-3 pt-3 font-medium">Global hitting percentage</Text>
            <View className="w-[100%]  h-[90%] flex flex-row justify-center">
              <View className="w-[95%] h-[100%] bg-brand-colordark-green justify-center rounded-xl flex flex-col">
                <Text className="text-white text-3xl pl-3 font-medium mb-2">Putting percentage</Text>
                <Text className="text-white text-5xl pl-3 font-light">{percentage}%</Text>
                {/* Graphic for up or down */}
                <View className="flex flex-row pl-3 items-center space-x-1">
                <FontAwesome6 name="arrow-trend-up" size={10} color={"#69DF87"} />                  
                <Text className="text-white">5.64%</Text>
                </View>


                <View className="w-[100%] h-[65%] flex flex-col justify-center items-center ">
                  <GestureHandlerRootView className="w-[100%] h-[100%] flex flex-row justify-center">
                    <LineGraph className="w-[90%] h-[90%]" 
                    points={graphdata}  
                    animated={true}
                    enablePanGesture={true} 
                    color="#fff"
                    onGestureStart={() => hapticFeedback('impactLight')}
                    onPointSelected={(p) => {setPerc(p.value)}}
                    onGestureEnd={() => setPerc("36.4")}
                    // onGestureEnd={() => resetPriceTitle()}
                    />
                    </GestureHandlerRootView>
                
                </View>
                <View className="flex flex-row w-[100%] justify-evenly pb-2">
                <Pressable  onPress={() => {changeGraph1()}} className=" bg-brand-colordark-greengray w-12 h-10 flex flex-row justify-center  rounded-xl items-center">
                    <Text className="font-bold">1D</Text>
                  </Pressable>
                  <Pressable  onPress={() => {changeGraph1()}} className=" bg-brand-colordark-greengray w-12 h-10 flex flex-row justify-center  rounded-xl items-center">
                    <Text className="font-bold">1W</Text>
                  </Pressable>
                  <Pressable onPress={() => {changeGraph2(); console.log(activeButton === "2W")}} className=" bg-brand-colordark-greengray w-12 h-10 flex flex-row justify-center  rounded-xl items-center">
                    <Text className="font-bold">2W</Text>
                  </Pressable>
                  <Pressable onPress={() => {changeGraph1()}} className="w-12 h-10 flex flex-row justify-center bg-brand-colordark-greengray rounded-xl items-center">
                    <Text className="font-bold">1M</Text>
                  </Pressable>
                  <Pressable onPress={() => {changeGraph1()}} className="w-12 h-10 flex flex-row justify-center bg-brand-colordark-greengray rounded-xl items-center">
                    <Text className="font-bold">3M</Text>
                  </Pressable>
                  {/* <Pressable onPress={() => {changeGraph2()}} className="w-32 h-10 flex flex-row justify-center bg-slate-200 rounded-xl items-center"><Text>points 2</Text></Pressable> */}
                </View>
              </View>
            </View>
        </View>
    </View>
  )
}

