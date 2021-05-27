/** @providesModule Editor
 **/

import React, {Component} from "../utils/react-tuned"
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Appearance
} from 'react-native'

export default class extends Component {

  render() {
    var {parent, node} = this.props
    var value = `${node.name}: ${node.description}`
    return <View>
      <TextInput
        onBlur={_=> parent.setState({editing: false})}
        onChangeText={text => console.log(text)}
        value={value}
        style={{}}
        multiline={true}
        autoFocus={true}
        autoCapitalize={'none'}
        autoCorrect={false}
      />
    </View>
  }

}