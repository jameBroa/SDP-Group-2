import { Link } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';

const Button = ({ text, onPress=null, goTo }) => {
    return (
        <Link className="my-2" href={goTo} asChild>
            <Pressable className="bg-stone-200 rounded-xl border-2 border-stone-200 py-3 px-6 font-boldm-2 min-w-full" onPress={onPress}> 
                <Text className="[font-family:'Poppins-Medium',Helvetica] text-base text-stone-600 text-center font-medium"> {text} </Text>
            </Pressable>
        </Link>
  );
};

export default Button;
