import React, { useState } from 'react'
import DefaultContainer from '../../components/DefaultContainer'
import { Pressable, Text, View } from 'react-native'

export default function social() {
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


  return (



      <View className="w-[100%] h-[100%]">

      
        <Text>test</Text>



      </View>
    
  )
}