/** @providesModule Editor
 **/

import React, {Component} from "../utils/react-tuned"
import {
  Text,
  TextInput,
  View,
  Alert,
  Appearance
} from 'react-native'
import menuController from "./menu/menuController";
import dashboard from "./dashboard";
import Undo from "./Undo";
import {showFlash} from "./commonFunctions";
import EditMenu from "./menu/EditMenu";


export default class extends Component {

  constructor(props) {
    super(props)
    var {node} = props
    var value = `${node.name}: ${node.description || ''}`
    if (value.startsWith('New record')) value = ''
    this.state = {value}
    this.undo = new Undo(this.state.value)
  }

  save() {
    var {node} = this.props, v = this.state.value, data
    var splitter = v.indexOf(':')
    if (splitter >= 0)
      data = {
        name: v.slice(0, splitter).trim(),
        description: v.slice(splitter + 1).trim()
      }
    else
      data = { name: v, description: "" }
    if (!data.name) data.name = Date.now()
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

  onFocus() {
    new EditMenu(this.props.node, this)
  }

  onBlur() {
    this.save()
  }

  onChangeText(value) {
    this.undo.changed(value)
    this.setState({value})
  }

  doUndo() {
    this.setState({value: this.undo.undo()})
  }

  render() {
    return <View>
      <TextInput
        onBlur={this.onBlur}
        onFocus={this.onFocus}
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