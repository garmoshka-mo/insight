
import ComponentController from "../utils/ComponentController"
import React from "../utils/react-tuned";
import PlainItem from "./PlainItem"
import RichItem from "./RichItem"

export default class Node extends ComponentController {

  children = []

  render() {
    var component = this.children.length ? RichItem : PlainItem
    return React.createElement(
      component, {key: this.name, node: this}
    )
  }

  constructor(name, content, parent) {
    super()
    this.name = name
    this.parent = parent
    this.level = parent ? parent.level + 1 : 0
    this.parseContent(content)
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
    if (this.children.length > 0) {
      var result = {}
      if (this.description)
        result["_"] = this.description
      this.children.each(node => {
        result[node.name] = node.dump()
      })
     return result
    } else
      return this.description
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