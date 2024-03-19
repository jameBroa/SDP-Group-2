import { TouchableOpacity, View } from "react-native";
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

const VideoMenu = () => {
    const [showMenu, setShowMenu] = React.useState(false);
  
    return (
      <View style={{}}>
        <Menu
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <TouchableOpacity onPress={() => setShowMenu(true)}>
              <MaterialCommunityIcons
                name="earth"
                size={30}
                style={{ color: 'black' }}
              />
            </TouchableOpacity>
          }>
          <Menu.Item onPress={() => {}} title="Item 1" />
          <Menu.Item onPress={() => {}} title="Item 2" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Item 3" />
        </Menu>
      </View>
    );
  };

export default VideoMenu;