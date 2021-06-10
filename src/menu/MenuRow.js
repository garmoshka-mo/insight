import React, {Component} from "../../utils/react-tuned";
import {Text, TouchableOpacity, View} from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import {colors} from '../styles'

export default class MenuRow extends Component {

  constructor({controller}) {
    super()
    if (controller) this.subscribeTo(controller)
  }

  render() {
    return <View style={[{flexDirection: 'row'}, this.props.style]}>
      {this.buttons()}
    </View>
  }

  buttons() {
    return this.props.buttons.map(this.button)
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
      size: this.scale(30),
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
      <Text style={{fontSize: this.scale(22), color}} >
        {emoji}
      </Text>
    </View>
  }

  scale(number) {
    var {size} = this.props
    if (!size) return number
    return number * size
  }

}
