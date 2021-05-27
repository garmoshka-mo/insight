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
import menuController from "./menuController";
import {showFlash} from "./commonFunctions";


export default class extends Component {

  constructor(props) {
    super(props)
    var {node} = props
    this.state = {
      value: `${node.name}: ${node.description}`
    }
    menuController.set([
      {icon: 'ellipsis-v', action: this.split},
      {icon: 'check', action: this.save},
    ])
  }

  save() {
    var {node} = this.props, v = this.state.value, data
    var splitter = v.indexOf(':')
    if (splitter > 0)
      data = {
        name: v.slice(0, splitter).trim(),
        description: v.slice(splitter + 1).trim()
      }
    else
      data = { name: v, description: "" }
    node.update(data)

    this.props.parent.setState({editing: false})
  }

  split() {
    var v = this.state.value, c = this.cursor
    var splitter = v.indexOf(":")
    if (splitter >= 0) {
      v = v.slice(0, splitter) + v.slice(splitter + 1)
      if (splitter < c) c--
    }
    this.setState({
      value: v.slice(0, c) + ":" + v.slice(c)
    })
  }

  blur() {
    this.save()
  }

  render() {
    return <View>
      <TextInput
        onBlur={this.blur}
        onChangeText={value => this.setState({value})}
        onSelectionChange={
          (event) => this.cursor = event.nativeEvent.selection?.start
        }
        value={this.state.value}
        style={{}}
        multiline={true}
        autoFocus={true}
        autoCapitalize={'none'}
        autoCorrect={false}
      />
    </View>
  }

}