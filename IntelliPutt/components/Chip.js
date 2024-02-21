{/* 
    Makes the individual choices for skill level in the registration process.
*/}

import React from 'react';
import { Pressable, Text } from 'react-native';
import COLOURS from '../static/design_constants';

const Chip = ({ text, selected, setSelected, color=COLOURS.BRAND_COLORDARK_GREEN, bWidth='fit', ml='6px'}) => {
        return (
            <Pressable 
                title = {text}
                onPress={() => {
                    setSelected(text);
                }}
                className="transition-colors rounded-xl relativeborder-2 py-3 px-3 font-boldm-2"
                style={{  
                        backgroundColor: selected ? color : "#e7e5e4",
                        borderColor: selected ? color : "#e7e5e4",
                        width: bWidth,
                    }}
                    >
                <Text className="relative text-base flex justify-center" style={{ color: selected ? "#FFFFFF" : "#000000"}} >
                    {text}
                </Text>
            </Pressable>
        );
    };

export default Chip;
