{/* 
    Makes the individual choices for skill level in the registration process.
*/}

import React from 'react';
import { Pressable, Text } from 'react-native';
import COLOURS from '../static/design_constants';

const Chip = ({ text, selected, setSelected, color=COLOURS.BRAND_COLORDARK_GREEN}) => {
        return (
            <Pressable 
                title = {text}
                onPress={() => {
                    setSelected(text);
                }}
                className="transition-colors rounded-xl relativeborder-2 py-3 px-3 font-boldm-2 ml-1.5"
                style={{  
                        backgroundColor: selected ? color : "#e7e5e4",
                        borderColor: selected ? color : "#e7e5e4"
                    }}
                    >
                <Text className="relative text-base" style={{ color: selected ? "#FFFFFF" : "#000000"}} >
                    {text}
                </Text>
            </Pressable>
        );
    };

export default Chip;
