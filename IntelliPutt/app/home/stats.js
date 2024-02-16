import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import DefaultContainer from '../../components/DefaultContainer'
import { LineGraph } from 'react-native-graph'
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import COLOURS from '../../static/design_constants';
import { FontAwesome6 } from '@expo/vector-icons';
import {useStore, useSelector} from 'react-redux';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import {convertUserData, filterByWeek, filterByXMonth, filterByXWeek, getData, getLabels, getPercentage} from '../../logic/stats-logic';
import {getGlobalPercentage} from '../../logic/stats-logic';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";


export default function stats() {

  const screenWidth = Dimensions.get("window").width;

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
  const [activeButton, setActiveButton] = useState("W1")
  const [userData, setUserData] = useState({});
  const [globalPercentage, setGlobalPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [graphLabels, setGraphLabels] = useState(["January", "February"]);
  const [graphdata, setgraphdata] = useState([Math.random() * 100, Math.random() * 100])

  // Redux vars
  const currUser = useSelector((state) => state.user.user);
  const uid = currUser.uid;

  // Firebase vars
  const userCollectionRef = collection(firestore, "users");
  const userDataCollectionRef = collection(firestore, "users/" + uid + "/data");

  useEffect(() => {
    const getUserData = async() => {
      try{
        const q = query(userDataCollectionRef);
        const response = await getDocs(q);
        let puttingData = [];
        response.docs.map((doc) => {
          puttingData.push(doc.data());
        })

        const putts = convertUserData(puttingData);
        console.log(putts);

        setUserData(putts);
        // setgraphdata(putts);
        
        const globalPercentage = getGlobalPercentage(puttingData);
        const labels = getLabels(putts)
        const data = getData(putts);
        setGraphLabels(labels);
        setgraphdata(data);
        setGlobalPercentage(globalPercentage);
        setLoading(false);

      } catch(error) {
        console.log(error)
      }
    }
    getUserData();
  }, [uid]);

  const filterOneWeek = () => {
    filteredDate = filterByXWeek(userData, 1);
    const labels = getLabels(filteredDate);
    const data = getData(filteredDate);
    const percentage = getPercentage(filteredDate);
    setGraphLabels(labels);
    setgraphdata(data);
    setGlobalPercentage(percentage);
  }

  const filterTwoWeek = () => {
    filteredDate = filterByXWeek(userData, 2);
    const labels = getLabels(filteredDate);
    const data = getData(filteredDate);
    const percentage = getPercentage(filteredDate);
    setGraphLabels(labels);
    setgraphdata(data);
    setGlobalPercentage(percentage);
  }

  const filterMonth = () => {
    filteredDate = filterByXMonth(userData, 1);
    const labels = getLabels(filteredDate);
    const data = getData(filteredDate);
    const percentage = getPercentage(filteredDate);
    setGraphLabels(labels);
    setgraphdata(data);
    setGlobalPercentage(percentage);
  }

  const filterThreeMonth = () => {
    filteredDate = filterByXMonth(userData, 3);
    const labels = getLabels(filteredDate);
    const data = getData(filteredDate);
    const percentage = getPercentage(filteredDate);
    setGraphLabels(labels);
    setgraphdata(data);
    setGlobalPercentage(percentage);
  }

  const resetGraph = () => {
    const labels = getLabels(userData)
    const data = getData(userData)
    const percentage = getPercentage(userData)
    setGraphLabels(labels);
    setgraphdata(data);
    setGlobalPercentage(percentage); 
  }

  


  // const changeGraph1 = useCallback(() => {

  //   userData.map((item) => {
  //     console.log(item.value);
  //   })
  //   console.log(userData)
  //   console.log("userData")
    
  //   setgraphdata((userData))
    
  // }, [userData, setgraphdata])

  // const changeGraph2 = useCallback(() => {
  //   setgraphdata(POINTS2)
  //   setActiveButton("W2")

  // }, [userData, setgraphdata])

  

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
                <View className="flex flex-row space-x-5">
                  <Text className="text-white text-5xl pl-3 font-light">{globalPercentage}%</Text>
                  <View className="flex flex-row space-x-1 items-center">
                    <FontAwesome6 name="arrow-trend-up" size={10} color={"#69DF87"} />                  
                    <Text className="text-white">5.64%</Text>
                  </View>
                  
                </View>
                {/* Graphic for up or down */}
                {/* <View className="flex flex-row pl-3 items-center space-x-1"> */}
                  
                {/* </View> */}
                <View className="w-[100%] h-[65%] flex flex-col justify-center items-center ">
                <LineChart
                  data={{
                    labels: graphLabels,
                    datasets: [
                      {
                        data: graphdata
                      }
                    ]
                  }}
                  width={360} // from react-native
                  height={270}
                  yAxisLabel=""
                  yAxisSuffix="%"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor:"#fff",
                    // backgroundColor: "#e26a00",
                    // backgroundGradientFrom: "#fb8c00",
                    // backgroundGradientTo: "#ffa726",
                    backgroundGradientFrom: COLOURS.DARK_GREEN,
                    backgroundGradientTo: COLOURS.DARK_GREEN,
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: COLOURS.MEDIUM_GOLD
                    }
                  }}
                  bezier
                  withVerticalLabels={false}
                  // fromZero={true}
                  
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                />
                    {/* <GestureHandlerRootView className="w-[100%] h-[100%] flex flex-row justify-center">
                      <LineGraph className="w-[90%] h-[90%]" 
                      points={graphdata}  
                      animated={true}
                      enablePanGesture={true} 
                      color="#fff"
                      // onGestureStart={() => hapticFeedback('impactLight')}
                      onPointSelected={(p) => {console.log(p)}}
                      // onGestureEnd={() => setPerc("36.4")}
                      // onGestureEnd={() => resetPriceTitle()}
                      TopAxisLabel={() => <Text>lol</Text>}
                      BottomAxisLabel={() => <Text>lol</Text>}
                      />
                      </GestureHandlerRootView> */}
                    
                
                </View>
                <View className="flex flex-row w-[100%] justify-evenly pb-2">
                <Pressable  onPress={() => {resetGraph()}} className=" bg-brand-colordark-greengray w-12 h-10 flex flex-row justify-center  rounded-xl items-center">
                    <Text className="font-bold">ALL</Text>
                  </Pressable>
                  <Pressable  onPress={() => {filterOneWeek()}} className=" bg-brand-colordark-greengray w-12 h-10 flex flex-row justify-center  rounded-xl items-center">
                    <Text className="font-bold">1W</Text>
                  </Pressable>
                  <Pressable onPress={() => {filterTwoWeek()}} className=" bg-brand-colordark-greengray w-12 h-10 flex flex-row justify-center  rounded-xl items-center">
                    <Text className="font-bold">2W</Text>
                  </Pressable>
                  <Pressable onPress={() => {filterMonth()}} className="w-12 h-10 flex flex-row justify-center bg-brand-colordark-greengray rounded-xl items-center">
                    <Text className="font-bold">1M</Text>
                  </Pressable>
                  <Pressable onPress={() => {filterThreeMonth()}} className="w-12 h-10 flex flex-row justify-center bg-brand-colordark-greengray rounded-xl items-center">
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

