import React, {Component} from "../../utils/react-tuned";
import {Text, TouchableOpacity, View} from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import menuController from "./menuController"
import MenuRow from "./MenuRow";

export default class Menu extends Component {

  controllers = [menuController]

  render() {
    return <View style={{
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 15,
      borderRadius: 20,
      backgroundColor: '#262626'
    }}>
      {this.tools()}
    </View>
  }

  tools() {
    var controller = menuController.head
    var {tools} = controller
    if (Array.isArray(tools))
      return <MenuRow buttons={tools} controller={controller}
              style={{flexWrap: 'wrap', justifyContent: 'center'}}
            />
    else
      return tools
  }

}
