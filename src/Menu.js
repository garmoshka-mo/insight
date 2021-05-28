import React, {Component} from "../utils/react-tuned";
import {Text, TouchableOpacity, View} from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome"
import styles from './styles'
import files from './files'
import auth from "./auth";
import {showFlash} from "./commonFunctions";
import menuController from "./menuController"

export default class Menu extends Component {

  controllers = [menuController]

  render() {
    return <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 15,
      borderRadius: 20,
      backgroundColor: '#262626'
    }}>
      {menuController.menu.map(_ => this.button(_))}
    </View>
  }

  button(button) {
    return <TouchableOpacity
      key={button.icon}
      style={{paddingHorizontal: 12}}
      onPress={button.action}
    >
      <Icon name={button.icon}
            size={40}
            style={{color: styles.textColor}}
      />
    </TouchableOpacity>
  }

}
