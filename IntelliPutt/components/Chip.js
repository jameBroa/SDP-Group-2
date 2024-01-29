{/* 
    Makes the individual choices for skill level in the registration process.
*/}

import React from 'react';
import { Pressable, Text } from 'react-native';

const Chip = ({ text, selected, setSelected,}) => {
        return (
            <Pressable 
                title = {text}
                onPress={() => {
                    setSelected(text);
                }}
                className="transition-colors rounded-xl relativeborder-2 py-3 px-3 font-boldm-2 ml-1.5"
                style={{  
                        backgroundColor: selected ? "#093923" : "#e7e5e4",
                        borderColor: selected ? "#093923" : "#e7e5e4"
                    }}
                    >
                <Text className="relative text-base" style={{ color: selected ? "#FFFFFF" : "#000000"}} >
                    {text}
                </Text>
            </Pressable>
        );
    };

export default Chip;
