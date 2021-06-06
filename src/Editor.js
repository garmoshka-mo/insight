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
import menuController from "./menuController";
import dashboard from "./dashboard";
import Undo from "./Undo";
import NodeTools from "./menu/NodeTools";


export default class extends Component {

  constructor(props) {
    super(props)
    var {node} = props
    this.node = node
    var value = `${node.name}: ${node.description || ''}`
    if (value.startsWith('New record')) value = ''
    this.state = {value}
    this.undo = new Undo(this.state.value)

    this.tools = [
      {icon: `emoji:🔥`, selected: _=> node.importance == 'important',
        action: _=> this.updateNode('importance', 'important', 'normal')},
      {icon: `emoji:❔`, selected: _=> node.importance == 'guess',
        action: _=> this.updateNode('importance', 'guess', 'normal')},
      {icon: `emoji:⏩`, selected: _=> node.alwaysExpanded,
        action: _=> this.updateNode('alwaysExpanded', true, false)},
      'break',

      {icon: 'chevron-left', left: true, action: menuController.pop},
      {icon: 'suitcase', action: this.showNodeTools},
      {icon: 'undo', action: _=>
          this.setState({value: this.undo.undo()})},

      {icon: 'ellipsis-v', action: this.split},
      {icon: 'check', action: this.save}
    ]
  }

  onMenuPop() {
    this.node.update({editing: false})
  }

  showNodeTools() {
    menuController.push(new NodeTools(this.props.node))
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
    menuController.push(this)
  }

  onBlur() {
    this.save()
  }

  onChangeText(value) {
    this.undo.changed(value)
    this.setState({value})
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

  updateNode(key, value, neutral) {
    var state = {[key]: value}
    if (this.node[key] == value) state[key] = neutral
    this.node.update(state)
    menuController.refresh()
  }

}