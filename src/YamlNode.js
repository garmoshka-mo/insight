
import ComponentController from "../utils/ComponentController"
import React from "../utils/react-tuned";
import PlainItem from "./PlainItem"
import RichItem from "./RichItem"

export default class YamlNode extends ComponentController {

  children = []

  constructor(name, content, level = 0) {
    super()
    this.name = name
    this.level = level
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
          new YamlNode(key, content[key], this.level + 1)
        )
    }
  }

  render() {
    var component = this.children.length ? RichItem : PlainItem
    return React.createElement(
      component, {key: this.name, node: this}
    )
  }

}