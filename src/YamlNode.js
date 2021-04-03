
import ComponentController from "../utils/ComponentController"

export default class YamlNode extends ComponentController {

  children = []

  constructor(name, content) {
    super()
    this.name = name
    this.parseContent(content)
  }

  parseContent(content) {
    Object.keys(this.state)

    if (typeof content == 'string') {
      this.description = content
      return
    }

    for(const key of content) {
      if (key == "_")
        this.description = content["_"]
      else
        this.children.push(
          new YamlNode(key, content[key])
        )
    }
  }

}