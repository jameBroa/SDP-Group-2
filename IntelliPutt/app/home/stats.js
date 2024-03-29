import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, Text, View, ScrollView } from 'react-native'
import DefaultContainer from '../../components/DefaultContainer'
import { useSelector} from 'react-redux';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import COLOURS from '../../static/design_constants';
import {calculatePercChange, convertUserData, filterByWeek, filterByXMonth, filterByXWeek, getData, getLabels, getPercentage} from '../../logic/stats-logic';
import { getGlobalPercentage } from '../../logic/stats-logic';
import { LineChart } from "react-native-chart-kit";
import {Svg, Text as TextSVG} from 'react-native-svg';
import StatsTab from '../../components/StatsTab';
import { Redirect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Stats() {
  // Redux vars
  const user = useSelector((state) => state.user.user);

  // Data vars
  const tabs = ["ALL", "1W", "2W", "1M", "3M"]

  // State management vars
  const [userData, setUserData] = useState({});
  const [globalPercentage, setGlobalPercentage] = useState(23);
  const [loading, setLoading] = useState(true);
  const [graphLabels, setGraphLabels] = useState(["January", "February"]);
  const [graphdata, setgraphdata] = useState([Math.random() * 100, Math.random() * 100])
  const [percentageChange, setPercentageChange] = useState(0);
  const [graphState, setGraphState] = useState(tabs[0]);

  useEffect(() => {
    if (user) {
      const userDataCollectionRef = collection(firestore, "users/" + user.uid + "/data");
      const getUserData = async() => {
        try {
          const q = query(userDataCollectionRef);
          const response = await getDocs(q);
          let puttingData = [];
          response.docs.map((doc) => {
            puttingData.push(doc.data());
          })

          const putts = convertUserData(puttingData);
          console.log(putts);

          setUserData(putts);
          
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
    }
  }, [user]);

  useEffect(() => {
    if(loading == false) {
    switch(graphState) {
      case "1W":
        filterOneWeek()
        break;
      case "2W":
        filterTwoWeek()
        break;
      case "1M":
        filterMonth()
        break;
      case "3M":
        filterThreeMonth()
        break;
      default:
        resetGraph();
        break;
    }
  }
  }, [graphState, loading])

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

  if (user) {
    return (
      <View className="w-full h-full flex flex-col">
          <View className="h-[30%]">
              <DefaultContainer subheading="Let's view your" heading="Statistics!"/>
          </View>
          <ScrollView className="h-[70%] w-full flex flex-col bg-stone-100">
              <View className="w-[100%] pt-3 h-[95%] flex flex-row justify-center items-center">
                <View className="w-[95%] h-[100%] rounded-xl flex flex-col">
                  <View className="mt-1 h-[10%]">
                    <Text className="text-xl text-gray-400 pl-1 mt-1 font-medium">Overall putting</Text>
                    <View className="flex flex-row space-x-5 absolute top-[5%] right-[3%]">
                      {/* Graphic for up or down */}
                      <View className="flex flex-row space-x-1 items-center">
                        <FontAwesome6 name="arrow-trend-up" size={10} color={"#69DF87"} />                  
                        <Text className="text-brand-colordark-green mt-1">{percentageChange}%</Text>
                      </View>
                      <Text className="text-grey-300 text-xl pl-3 font-semibold mt-1">{globalPercentage}%</Text>
                    </View>
                  </View>
                
                  <View className="w-full rounded-xl pt-[25px] flex flex-col justify-center items-center bg-[#283c0a]">
                    <LineChart
                      data={{
                        labels: graphLabels,
                        datasets: [
                          {
                            data: graphdata,
                          },
                          {
                            data: [100],
                            color : () => 'transparent', strokeWidth: 0, withDots: false,
                          },
                        ]
                      }}
                      width={360} // from react-native
                      height={250}
                      yAxisLabel=""
                      yAxisSuffix="%"
                      yAxisInterval={1} // optional, defaults to 1
                      chartConfig={{
                        backgroundColor:"#fff",
                        backgroundGradientFrom: "#283c0a",
                        backgroundGradientTo: "#283c0a",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 0.9) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                          borderRadius: 10,
                        },
                        propsForDots: {
                          r: "4",
                          strokeWidth: "2",
                          stroke: COLOURS.MEDIUM_GOLD
                        }
                      }}
                      bezier
                      withVerticalLabels={false}
                      fromZero={true}
                      onDataPointClick={({value, dataset, getColor}) => {
                        console.log(value);
                        return (
                          <Text className="z-10 text-4xl">{value}</Text>
                        )
                      }}
                      renderDotContent={({x, y, index, indexData}) => {
                        if(graphdata.length < 15) {
                          return (
                          <TextSVG
                            key={index}
                            x={x}
                            y={y - 10}
                            fill="white"
                            fontSize="12"
                            fontWeight="normal"
                            textAnchor="middle">
                            {graphdata[index]}
                          </TextSVG>
                        )
                        }
                      }}
                      style={{
                        borderRadius: 20,
                      }}
                    />

                    <View className="flex flex-row w-[100%] justify-evenly pb-3"> 
                      {tabs.map((tab) => {
                      return(
                        <StatsTab
                          text={tab}
                          selected={graphState === tab}
                          setSelected={setGraphState}
                          key={tab}
                          color={COLOURS.BRAND_COLORDARK_GREENGRAY}
                        />
                      )
                      })}             
                    </View>
                  </View>
                </View>
              </View>
          </ScrollView>
      </View>
    );
  }
}

