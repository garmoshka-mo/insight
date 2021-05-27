import React, {Component} from "../utils/react-tuned";
import {Text, TouchableOpacity, View} from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome"
import styles from './styles'
import files from './files'

export default class Menu extends Component {

  menu = [
    {icon: 'bath', action: _=> 1},
    {icon: 'folder-open', action: files.showList}
  ]

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
      {this.menu.map(_ => this.button(_))}
    </View>
  }

  button(button) {
    return <TouchableOpacity
      key={button.icon}
      style={{paddingHorizontal: 10}}
      onPress={button.action}
    >
      <Icon name={button.icon}
            size={40}
            style={{color: styles.textColor}}
      />
    </TouchableOpacity>
  }

}