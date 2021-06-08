
import ComponentController from "../utils/ComponentController"
import React from "../utils/react-tuned";
import NodeComponent from "./NodeComponent"
import menuController from "./menuController";
import dashboard from "./dashboard";
import {logr, showFlash} from "./commonFunctions";
import {Text, TouchableOpacity} from "react-native";
import { hideMessage } from "react-native-flash-message"

const IMPORTANCES = {important: "🔥", guess: "❔", normal: ""}
const EXPANDED = ">>"

export default class Node extends ComponentController {

  importance = 'normal'
  alwaysExpanded = false
  children = []

  constructor(name, content, parent, props) {
    super()
    Object.assign(this, props)
    Object.entries(IMPORTANCES).some(([key, icon]) => {
      if (name.startsWith(icon)) {
        this.importance = key
        name = name.substr(icon.length).trim()
        return true
      }
    })
    this.name = name
    this.parent = parent
    this.level = parent ? parent.level + 1 : 0
    this.parseContent(content)

    var {description} = this
    // temporary hotfix:
    if (description?.startsWith("⏩️"))
      description = description.replace("⏩️", EXPANDED)

    if (description?.startsWith(EXPANDED)) {
      this.alwaysExpanded = true
      this.description = description.substr(EXPANDED.length).trim()
    }
    this.expanded = this.alwaysExpanded || this.isNew
  }

  render() {
    return React.createElement(
      NodeComponent, {key: this.name, node: this}
    )
  }

  parseContent(content) {
    if (typeof content == 'string') {
      this.description = content
      return
    }

    for(const key in content) {
      if (key == "_")
        this.description = content["_"]
      else
        this.children.push(
          new Node(key, content[key], this)
        )
    }
  }

  dump() {
    var description = this.expandedEmoji + (this.description || '')
    if (this.children.length > 0) {
      var result = {}
      if (description) result["_"] = description
      this.children.each(node => {
        var key = `${node.importanceEmoji}${node.name}`
        result[key] = node.dump()
      })
     return result
    } else
      return description
  }

  get importanceEmoji() {
    var emoji = IMPORTANCES[this.importance]
    return emoji.length > 0 ? `${emoji} ` : emoji
  }

  get expandedEmoji() {
    // `${EXPANDED} `
    return this.alwaysExpanded ? `>> ` : ''
  }

  updateFlag(key, value, neutral) {
    var state = {[key]: value}
    if (this[key] == value) state[key] = neutral
    if (key == 'alwaysExpanded') state.expanded = state[key]
    this.update(state)
    menuController.refresh()
  }

  move(dir = -1) {
    var ch = this.parent.children
    var from = ch.indexOf(this)
    var to = from + dir
    if (to >= 0 && to < ch.length) {
      ch.move(from, to)
      this.parent.refresh()
    } else if (this.parent.parent) {
      ch.delete(this)
      ch = this.parent.parent.children
      var at = ch.indexOf(this.parent)
      if (dir > 0) at++
      ch.insert(at, this)
    }
  }

  edit() {
    this.update({editing: true})
  }

  addSibling() {
    var ch = this.parent.children
    var at = ch.indexOf(this) + 1
    var n = this._newNode(this.parent)
    ch.insert(at, n)
    this.parent.refresh()
    n.edit()
  }

  addChild() {
    var n = this._newNode(this)
    this.children.push(n)
    this.update({expanded: true})
    n.edit()
  }

  delete() {
    var index = this.parent.children.indexOf(this)

    this.parent.children.delete(this)
    this.parent.refresh()
    menuController.reset()
    dashboard.save()

    var restore = () => {
      this.parent.children.insert(index, this)
      this.parent.refresh()
      dashboard.save()
      hideMessage()
    }

    showFlash('Node deleted', {
      duration: 4000,
      type: 'default',
      renderCustomContent: _=>
        <TouchableOpacity
          style={{alignSelf: 'center', padding: 10, backgroundColor: 'white' }}
          onPress={restore}>
          <Text>Undo</Text>
        </TouchableOpacity>
    })
  }

  // private

  _newNode(parent) {
    return new Node(`New record ${Date.now()}`, "", parent, {isNew: true})
  }

}