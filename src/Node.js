
import ComponentController from "../utils/ComponentController"
import React from "../utils/react-tuned";
import NodeComponent from "./node/NodeComponent"
import menuController from "./menu/menuController";
import dashboard from "./dashboard";
import {logr, showFlash} from "./commonFunctions";
import {Animated, Text, TouchableOpacity} from "react-native";
import { hideMessage } from "react-native-flash-message"
import {move, moveToChild} from './node/moving'

const IMPORTANCES = {
  important: ["🔥", '=*'],
  guess: ["❔", '=?'],
  archived: ["📦", "=0"],
  normal: ["", null]
}
const EXPANDED = "=>"

export default class Node extends ComponentController {

  importance = 'normal'
  alwaysExpanded = false
  children = []

  constructor(name, content, parent, props) {
    super()
    Object.assign(this, props)
    Object.entries(IMPORTANCES).some(([importance, [emoji, alias]]) => {
      if (name.startsWith(emoji) || name.startsWith(alias)) {
        this.importance = importance
        var l = name.startsWith(emoji) ? emoji.length : alias.length
        name = name.substr(l).trim()
        return true
      }
    })
    this.name = name
    this.parent = parent
    this.level = parent ? parent.level + 1 : 0
    this.parseContent(content)

    var {description} = this
    // temporary hotfix:
    if (description?.startsWith(">>"))
      description = description.replace(/^>>/, EXPANDED)

    if (description?.startsWith(EXPANDED)) {
      this.alwaysExpanded = true
      this.description = description.substr(EXPANDED.length).trim()
    }
    if (this.alwaysExpanded || this.isNew) this.expanded = true
  }

  render() {
    return <NodeComponent key={this.name} node={this} />
  }

  parseContent(content) {
    if (typeof content == 'string') {
      this.description = content
      return
    }

    for(const key in content) {
      if (key == "_")
        this.description = content["_"]
      else if (key == "_id")
        this.id = content._id
      else
        this.children.push(
          new Node(key, content[key], this)
        )
    }
  }

  dump() {
    var description = this.expandedEmoji + (this.description || '')
    var {children} = this
    if (this.id) {
      children = children.clone()
      children._id = this.id
    }
    if (this.children.length > 0) {
      var result = {}
      if (description) result["_"] = description
      this.children.each(node => {
        var key = `${node.importanceEmoji}${node.name}`
        result[key] = node.dump()
      })
     return result
    } else
      return description || null
  }

  get importanceEmoji() {
    var emoji = IMPORTANCES[this.importance][0]
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
    move(this, dir)
  }

  moveToChild(dir = -1) {
    moveToChild(this, dir)
  }

  edit() {
    this.update({editing: true})
  }

  editSibling(dir) {
    var n = this._newNode(this.parent)
    this.addSibling(n, dir)
    n.edit()
  }

  addSibling(n, dir = +1) {
    var ch = this.parent.children
    var at = ch.indexOf(this)
    if (dir == +1) at++
    ch.insert(at, n)
    this.parent.refresh()
  }

  editChild() {
    var n = this._newNode(this)
    this.addChild(n)
    n.edit()
  }

  addChild(n, toEnd = false) {
    if (toEnd) this.children.push(n)
    else this.children.unshift(n)
    this.update({expanded: true})
  }

  delete() {
    var index = this.parent.children.indexOf(this)

    this.delete_()
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

  delete_() {
    this.parent.children.delete(this)
    this.parent.refresh()
  }

  get root() {
    return this.parent?.root || this
  }

  find(id) {
    if (this.id == id) return this
    return this.children.extractOne(ch => ch.find(id))
  }

  // private

  _newNode(parent) {
    return new Node(`New record ${Date.now()}`, "", parent, {isNew: true})
  }

  focus() {
    this.viewRef.measure( (fx, fy, width, height, px, py) => {
      dashboard.scrollTo(py - 100)
    })

    this.backgroundAnim.setValue(1)
    Animated.timing(
      this.backgroundAnim,
      {
        toValue: 0,
        duration: 1500,
      }
    ).start()
  }

}