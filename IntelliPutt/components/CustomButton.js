{/* 
    Default button component for IntelliPutt.
*/}

import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';

const CustomButton = ({ text, onPress=null, goTo=null }) => {
    const [buttonClicked,setButtonClicked] = useState(false);
    const stylesButton = buttonClicked? "my-2 bg-stone-400 rounded-xl border-2 border-stone-600 py-3 px-6 font-boldm-2 min-w-full":"my-2 bg-stone-200 rounded-xl border-2 border-stone-200 py-3 px-6 font-boldm-2 min-w-full";
    const stylesText = buttonClicked ? "[font-family:'Poppins-Medium',Helvetica] text-base text-stone-200 text-center font-medium": "[font-family:'Poppins-Medium',Helvetica] text-base text-stone-600 text-center font-medium";
    if (goTo == null) {
        return (
            <Pressable className={stylesButton} onPress={onPress} onPressIn={() => setButtonClicked(true)} onPressOut={() => setButtonClicked(false)}> 
                <Text className={stylesText}> {text} </Text>
            </Pressable>
        );
    } else {
        return (
            <Link className="my-2" href={goTo} asChild>
                <Pressable className={stylesButton} onPress={onPress} onPressIn={() => setButtonClicked(true)} onPressOut={() => setButtonClicked(false)}> 
                    <Text className={stylesText}> {text} </Text>
                </Pressable>
            </Link>
        );
    }
};

export default CustomButton;
