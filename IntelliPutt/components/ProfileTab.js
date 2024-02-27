import React from 'react';
import { Text, View } from 'react-native';
import COLOURS from '../static/design_constants';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileTab = ({ icon, text }) => {
    if (icon == "friends") {
        return ( 
        <View 
            className="rounded-xl w-[32%] t-2 py-3 px-3 font-boldm-2 bg-brand-colordark-green justify-evenly flex flex-row"
            >
            {
                <Ionicons name="people" size={18} color={COLOURS.MEDIUM_GOLD} />
            }
            <Text className="relative text-base flex justify-center text-stone-50">
                {text}
            </Text>
        </View>
        );
    }

    return (
        <View 
            className="rounded-xl w-[28%] py-3 px-3 font-boldm-2 bg-brand-colordark-green justify-evenly flex flex-row"
            >
            {
                icon == "golf" ? (
                    <Ionicons name="golf" size={16} color={COLOURS.MEDIUM_GOLD} />
                    ) : (
                    <MaterialIcons name="local-fire-department" size={18} color="#ff724f" />
                    )
            }
            <Text className="relative text-base flex justify-center text-stone-50">
                {text}
            </Text>
        </View>
    );
    };

export default ProfileTab;