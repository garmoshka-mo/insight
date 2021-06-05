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
import dashboard from "./dashboard";
import Undo from "./Undo";
import NodeTools from "./nodeTools";


export default class extends Component {

  constructor(props) {
    super(props)
    var {node} = props
    this.state = {
      value: `${node.name}: ${node.description}`
    }
    this.undo = new Undo(this.state.value)

    menuController.push([
      {icon: 'suitcase', action: this.showNodeTools},
      {icon: 'undo', action: _=>
          this.setState({value: this.undo.undo()})},

      {icon: 'ellipsis-v', action: this.split},
      {icon: 'check', action: this.save}
    ])
  }

  showNodeTools() {
    menuController.push(new NodeTools(this.props.node))
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
    data.editing = false
    node.update(data)
    menuController.pop()
    dashboard.save()
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

  onChangeText(value) {
    this.undo.changed(value)
    this.setState({value})
  }

  render() {
    return <View>
      <TextInput
        onBlur={this.blur}
        onChangeText={this.onChangeText}
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