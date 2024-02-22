import React from 'react';
import { Pressable, Text } from 'react-native';
import COLOURS from '../static/design_constants';

const StatsTab = ({ text, selected, setSelected, color=COLOURS.BRAND_COLORDARK_GREEN, bWidth='fit'}) => {
        return (
            <Pressable 
                title = {text}
                onPress={() => {
                    setSelected(text);
                }}
                className= {"transition-colors rounded-xl relativeborder-2 py-3 px-3 font-boldm-2 "
                    + (selected ? "bg-brand-colordarkgreen" : "bg-red-100")
                }
                style={{  
                        backgroundColor: selected ? color : "#e7e5e4",
                        borderColor: selected ? color : "#e7e5e4",
                        width: bWidth,
                    }}
                    >
                <Text className="relative text-xs flex justify-center" style={{ color: selected ? "#FFFFFF" : "#000000"}} >
                    {text}
                </Text>
            </Pressable>
        );
    };

export default StatsTab;