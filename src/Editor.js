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
import Node from "./Node"

export default class extends Component {

  constructor(props) {
    super(props)
    var {node} = props
    var value = this.getValue(node)
    if (value.startsWith('New record')) value = ''
    this.state = {value}
    this.undo = new Undo(this.state.value)
  }

  render() {
    return <View>
      <TextInput
        ref={ref => this.ref = ref}
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

  getValue(node) {
    if (!node.description) return node.name
    return `${node.name}: ${node.description || ''}`
  }

  save() {
    var {node} = this.props
    var data = this.parseItem(this.state.value)
    data.editing = false
    node.update(data)
    menuController.pop()
    dashboard.save()
  }

  parseItem(v) {
    var splitter = v.indexOf(':'), data
    if (splitter >= 0)
      data = {
        name: v.slice(0, splitter).trim(),
        description: v.slice(splitter + 1).trim()
      }
    else
      data = { name: v, description: "" }
    if (!data.name) data.name = `${Date.now()}`
    return data
  }

  parseSubItems() {
    var data, prevParent, isChild
    this.state.value.split("\n").each(line => {
      if (line.trim().length < 2) return
      isChild = prevParent && line.startsWith('-')
      if (isChild) line.replace(/^-/, '')
      data = this.parseItem(line)

      if (prevParent) {
        var node = new Node(data.name, data.description,
          isChild ? prevParent : prevParent.parent,
          {isNew: true})
        if (isChild)
          prevParent.addChild(node, 'toEnd')
        else {
          prevParent.addSibling(node)
          prevParent = node
        }
      } else {
        node = this.props.node
        node.update(data)
        this.setState({value: this.getValue(node)})
        prevParent = node
      }
    })

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
    setTimeout(_=> this.focused = true, 200) // hotfix for self-blurring
  }

  onBlur() {
    if (!this.focused) return this.ref.focus()
    this.save()
  }

  onChangeText(value) {
    this.undo.changed(value)
    this.setState({value})
  }

  doUndo() {
    this.setState({value: this.undo.undo()})
  }

}