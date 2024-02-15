{/* 
    Default text field component for IntelliPutt.
*/}

import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const TextField = ({ placeholder, value, onChangeText }) => {
    const [showPassword, setShowPassword] = useState(false); 
    const toggleShowPassword = () => { 
        setShowPassword(!showPassword); 
    }; 

    if (placeholder == "Password") {
        return (
            <View className="bg-lime-950 flex-row items-center px-14 rounded-lg border-2 border-lime-950 p-4 mt-3">
                <TextInput
                    className="text-stone-50 text-base font-medium pr-[10] w-[90%]"
                    placeholderTextColor="#f5f5f4"
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={!showPassword}
                />
                <MaterialCommunityIcons 
                    className="w-[10%] mr-[20px]"
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={24} 
                    color="#f5f5f4"
                    onPress={toggleShowPassword} 
                    textContentType='oneTimeCode'
                />
            </View>
        );
    };

    if (placeholder == "Email") {
        return (
            <TextInput
                className="bg-lime-950 w-full rounded-lg border-2 border-lime-950 p-4 text-stone-50 text-base mt-3 font-medium"
                placeholderTextColor="#f5f5f4"
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                textContentType='oneTimeCode'
                inputMode='email'
            />
        );
    }

    if (placeholder == "Name") {
        return (
            <TextInput
                className="bg-lime-950 w-full rounded-lg border-2 border-lime-950 p-4 text-stone-50 text-base mt-3 font-medium"
                placeholderTextColor="#f5f5f4"
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                required
            />
        );
    }

    return (
        <TextInput
            className="bg-lime-950 w-full rounded-lg border-2 border-lime-950 p-4 text-stone-50 text-base mt-3 font-medium"
            placeholderTextColor="#f5f5f4"
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
        />
    );
};

const styles = {
    passwordContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f3f3f3', 
        borderRadius: 8, 
        paddingHorizontal: 14, 
    },
}

export default TextField;
