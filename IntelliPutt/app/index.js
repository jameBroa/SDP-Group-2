import { Link, Stack, useRouter } from 'expo-router';
import { Image, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import COLOURS from '../static/design_constants';


function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('../static/logo_transparent.png')}
    />
  );
}

export default function Home() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen
            options={{
            headerStyle: { backgroundColor: COLOURS.MEDIUM_GREEN },
            headerTintColor: COLOURS.TINT,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerTitle: props => <LogoTitle {...props} />,
            }}
        />
        
        <Link href="/register">Register</Link>
        </View>
    );
}