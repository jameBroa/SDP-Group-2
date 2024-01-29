import React from 'react';
import { TextInput } from 'react-native';

const TextField = ({ placeholder, value, onChangeText }) => {
    return (
        <TextInput
            className="bg-lime-950 w-full rounded-lg border-2 border-lime-950 p-4 text-stone-50 text-base mt-3"
            placeholderTextColor="#f5f5f4"
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}  
        />
    );
};

export default TextField;
