import React, {Component} from "../utils/react-tuned";
import {Text, TouchableOpacity, View} from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import {colors} from './styles'
import menuController from "./menuController"

export default class Menu extends Component {

  controllers = [menuController]

  render() {
    return <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 15,
      borderRadius: 20,
      backgroundColor: '#262626'
    }}>
      {menuController.currentTools.map(_ => this.button(_))}
    </View>
  }

  button(button) {
    var style = {paddingHorizontal: 12}
    return <TouchableOpacity
      key={button.icon}
      style={style}
      onPress={button.disabled ? null : button.action}
    >
      {this.icon(button)}
    </TouchableOpacity>
  }

  icon(button) {
    var {icon} = button, m
    if ((m = icon.match(/^emoji:(.+)/))) {
      return this.emoji(button, m[1])
    } else if (icon.startsWith('material/')) {
      var material = true
      icon = icon.replace('material/', '')
    }
    var props = {
      name: icon,
      size: 30,
      style: {color: button.disabled ?
        colors.disabled :
        colors.text}
    }
    if (material)
      return <MaterialIcon {...props} />
    else
      return <Icon {...props} />
  }

  emoji(button, emoji) {
    var style = {}, color = '#000'
    if (!button.selected?.()) color = 'rgba(0,0,0,.2)'
    return <View style={style}>
      <Text style={{fontSize: 22, color: color}} >
        {emoji}
      </Text>
    </View>
  }

}
