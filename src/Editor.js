/** @providesModule Editor
 **/

import React, {Component} from "../utils/react-tuned"
import {
  Text,
  TextInput,
  View,
  Alert,
  Clipboard
} from 'react-native'
import menuController from "./menu/menuController";
import dashboard from "./dashboard";
import Undo from "./Undo";
import {showFlash} from "./commonFunctions";
import EditorMenu from "./menu/EditorMenu";
import Node from "./Node"

export default class extends Component {

  cursor = 0

  constructor(props) {
    super(props)
    var {node} = props
    this.node = node
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

  ensureUniqueName(data) {
    var originalName = data.name, i = 0
    while (this.props.node.parent.children
        .some(n => n != this.node && n.name == data.name)) {
      data.name = originalName + ++i
    }
  }

  parseItem(v) {
    var splitter = v.indexOf(':'), data
    if (splitter >= 0)
      data = {
        name: v.slice(0, splitter).trim(),
        description: v.slice(splitter + 1).trim()
      }
    else
      data = { name: v.trim(), description: "" }
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
          {expanded: true})
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

  insert(piece) {
    piece = piece.replace(/Источник: .*/, '')

    var c = this.cursor, v = this.state.value
    if (v[c - 1] && !v[c - 1].match(/[\s\n]/) && !piece.startsWith(' ')) {
      piece = " " + piece
    }
    if (v[c]?.match(/[\wа-яА-Я]/) && !piece.endsWith(' ')) {
      piece += " "
    }
    this.setState({
      value: v.slice(0, c) + piece + v.slice(c)
    })
    c += piece.length
    this.ref.setNativeProps({ selection:{ start:c, end:c } })
    this.ref.setNativeProps({ selection:{ } })
  }

  onFocus() {
    if (!this.menu)
      this.menu = new EditorMenu(this.props.node, this)
    setTimeout(_=> this.focused = true, 200) // hotfix for self-blurring
  }

  close() {
    this.node.update({editing: false})
  }

  onBlur() {
    if (this.focused) this.close()
    else this.ref.focus()
  }

  componentWillUnmount() {
    if (!this.state.value && this.cancelNewNode()) return
    this.save()
  }

  save() {
    var {node} = this
    var data = this.parseItem(this.state.value)
    data.isNew = false
    this.ensureUniqueName(data)
    node.update(data)
    dashboard.save()
  }

  cancelNewNode() {
    var {node} = this.props
    if (node.isNew) {
      node.delete_()
      return true
    }
  }

  onChangeText(value) {
    this.undo.changed(value)
    this.setState({value})
  }

  doUndo() {
    this.setState({value: this.undo.undo()})
  }

  async paste() {
    var value = await Clipboard.getString()
    this.insert(value)
  }

}