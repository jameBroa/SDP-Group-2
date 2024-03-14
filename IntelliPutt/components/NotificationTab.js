{/* 
    Makes the individual choices for skill level in the registration process.
*/}

import React from 'react';
import { Pressable, Text } from 'react-native';

const NotificationTab = ({ text, selected, setSelected, bWidth='fit'}) => {
        return (
            <Pressable 
                title = {text}
                onPress={() => {
                    setSelected(text);
                }}
                className= {
                    "transition-colors relativeborder-2 py-3 px-3 font-boldm-2 border-b-4 border-transparent "
                    + (selected ? "border-lime-900" : "border-stone-100")
                }
                style={{  
                        width: bWidth,
                    }}
                    >
                <Text className={"relative text-base flex justify-center " + 
                    (selected ? "text-stone-700 font-semibold" : "text-stone-500")
                }
                >
                    {text}
                </Text>
            </Pressable>
        );
    };

export default NotificationTab;
