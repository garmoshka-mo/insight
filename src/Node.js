
import ComponentController from "../utils/ComponentController"
import React from "../utils/react-tuned";
import PlainItem from "./PlainItem"
import RichItem from "./RichItem"

const IMPORTANCES = {important: "🔥", guess: "❔", normal: ""}
const EXPANDED = "⏩️"

export default class Node extends ComponentController {

  importance = 'normal'
  expanded = false
  children = []

  constructor(name, content, parent) {
    super()
    Object.entries(IMPORTANCES).some(([key, icon]) => {
      if (name.startsWith(icon)) {
        this.importance = key
        name = name.substr(icon.length)
        return true
      }
    })
    this.name = name
    this.parent = parent
    this.level = parent ? parent.level + 1 : 0
    this.parseContent(content)

    var {description} = this
    if (description?.startsWith(EXPANDED)) {
      this.expanded = true
      this.description = description.substr(EXPANDED.length)
    }
  }

  render() {
    var component = this.children.length ? RichItem : PlainItem
    return React.createElement(
      component, {key: this.name, node: this}
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
    var description = this.expandedEmoji + this.description
    if (this.children.length > 0) {
      var result = {}
      if (this.description)
        result["_"] = description
      this.children.each(node => {
        var icon = this.importanceEmoji
        var key = `${icon}${node.name}`
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
    return this.expanded ? `${EXPANDED} ` : ''
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

  addSibling() {
    var ch = this.parent.children
    var at = ch.indexOf(this) + 1
    ch.insert(at, this._newNode())
  }

  addChild() {
    this.children.push(this._newNode())
  }

  delete() {
    this.parent.children.delete(this)
  }

  // private

  _newNode() {
    return new Node("New record", "", this)
  }

}