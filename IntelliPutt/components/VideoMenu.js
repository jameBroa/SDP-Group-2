import { TouchableOpacity, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

const VideoMenu = () => {
    const [showMenu, setShowMenu] = React.useState(false);

    state = {
      items: ['sports']
    }
  
    return (
      <View style={{}}>
         <DropDownPicker
          items={[
            {label: 'Sports', value: 'sports', icon: () => <MaterialCommunityIcons name="flag" size={18} color="#900" />},
            {label: 'Books', value: 'book', icon: () => <MaterialCommunityIcons name="flag" size={18} color="#900" />},
          ]}
          
          placeholder=""
          multiple={true}
          multipleText="%d categories have been selected."
          min={0}
          max={3}
          defaultValue={'sports'}
          containerStyle={{height: 40, width: 40}}
          itemStyle={{
            justifyContent: 'flex-start'
          }}
          onChangeItem={item => this.setState({
            items: item // an array of the selected items
          })}
        />
      </View>
    );
  };

export default VideoMenu;