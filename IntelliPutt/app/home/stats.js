import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import DefaultContainer from '../../components/DefaultContainer'
import { useSelector} from 'react-redux';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import COLOURS from '../../static/design_constants';
import {calculatePercChange, convertUserData, filterByWeek, filterByXMonth, filterByXWeek, getData, getLabels, getPercentage} from '../../logic/stats-logic';
import {getGlobalPercentage} from '../../logic/stats-logic';
import {
  LineChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import {Svg, Text as TextSVG} from 'react-native-svg';
import Chip from '../../components/Chip';


export default function stats() {
  // Redux vars
  const currUser = useSelector((state) => state.user.user);

  if (currUser == null) {
    return <Redirect to="/app/" />
  }

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

  //data vars
  const tabs = ["ALL", "1W", "2W", "1M", "3M"]

  // State management vars
  const [activeButton, setActiveButton] = useState("W1")
  const [userData, setUserData] = useState({});
  const [globalPercentage, setGlobalPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [graphLabels, setGraphLabels] = useState(["January", "February"]);
  const [graphdata, setgraphdata] = useState([Math.random() * 100, Math.random() * 100])
  const [percentageChange, setPercentageChange] = useState(0);
  const [graphState, setGraphState] = useState(tabs[0]);

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
          puttingData.push(doc.data());
        })

        const putts = convertUserData(puttingData);
        console.log(putts);

        setUserData(putts);
        // setgraphdata(putts);
        
        const globalPercentage = getGlobalPercentage(puttingData);
        const labels = getLabels(putts)
        const data = getData(putts);
        // const percChange = calculatePercChange(putts);

        setGraphLabels(labels);
        setgraphdata(data);
        setGlobalPercentage(globalPercentage);
        setLoading(false);
        // setPercentageChange(percChange);

      } catch(error) {
        console.log(error)
      }
    }
    getUserData();
  }, [currUser]);


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

  return (
    <View className="w-full h-full flex flex-col">
        <View className="h-[30%] ">
            <DefaultContainer subheading="Let's view your" heading="Statistics!"/>
        </View>
        <View className=" h-[70%] w-full flex flex-col">
            {/* <Text className="text-xl text-gray-400 pl-3 pt-3 font-medium">Global hitting percentage</Text> */}
            <View className="w-[100%] pt-3 h-[95%] flex flex-row justify-center items-center">
              <View className="w-[95%] h-[100%] bg-brand-colordark-green justify-center rounded-xl flex flex-col">
                <Text className="text-white text-3xl pl-3 font-medium mb-2">Putting percentage</Text>
                <View className="flex flex-row space-x-5">
                  <Text className="text-white text-5xl pl-3 font-light">{globalPercentage}%</Text>
                  {/* <View className="flex flex-row space-x-1 items-center">
                    <FontAwesome6 name="arrow-trend-up" size={10} color={"#69DF87"} />                  
                    <Text className="text-white">{percentageChange}%</Text>
                  </View> */}
                  
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
                        data: graphdata,
                        
                      },
                      {
                        data: [100],
                        color : () => 'transparent', strokeWidth:0, withDots:false,
                      },
                    ]
                  }}
                  width={360} // from react-native
                  height={270}
                  yAxisLabel=""
                  yAxisSuffix="%"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor:"#fff",
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
                  fromZero={true}
                  onDataPointClick={({value, dataset, getColor}) => {
                    console.log(value);
                    return (
                      <Text className="z-10 text-4xl">{value}</Text>
                    )
                  }
                  
                  }
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
                    
                  }
                    
                  }
                  
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                />
                
                </View>
                <View className="flex flex-row w-[100%] justify-evenly pb-2">
                  
                 {tabs.map((tab) => {
                  return(
                    <Chip
                    text={tab}
                    selected={graphState === tab}
                    setSelected={setGraphState}
                    key={tab}
                    color={COLOURS.BRAND_COLORDARK_GREENGRAY}
                    />
                  )
                 })}






                {/* <ButtonGroup
                className="bg-slate-300"
                  items={items}
                  selectedItem={selectedItem}
                  onSelect={(newSelectedItem) => setSelectedItem(newSelectedItem)}
                /> */}


                {/* <Pressable onPress={() => {resetGraph()}} className=" bg-brand-colordark-greengray w-12 h-10 flex flex-row justify-center  rounded-xl items-center">
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
                  </Pressable> */}              
                </View>
              </View>
            </View>
        </View>
    </View>
  );
}

