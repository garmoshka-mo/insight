/** @providesModule YmlParser
 **/

import yaml from 'js-yaml'

export default class YmlParser {

  static parse(content) {
    return new this(content).parse()
  }

  constructor(content) {
    this.lines = content.replace(/\t/g, '  ').split("\n")
  }

  parse() {
    var {lines} = this
    var prevLine, prevSpaces = 0
    lines.forEach((line, i) => {
      var m = line.match(/^(\s*)/)
      var spaces = m ? m[1].length : 0

      // Normalize list items - add ":" in the end
      if (prevSpaces == spaces && line.trim() &&
          !line.includes(":") && prevLine.includes(":")) {
        lines[i] = line = line + ":"
      // Normalize <new line> descriptions:
      } else if (spaces == 0 && !line.includes(":")) {
        lines[i] = " ".repeat(prevSpaces) + line
        spaces = prevSpaces
      }

      if (prevSpaces < spaces) this.update(i - 1,
          this.normalizeDescription(prevLine, spaces)
        )
      if (line.includes(":"))
        this.lines[i] = line = this.cleanLine(line)

      prevLine = line
      prevSpaces = spaces
    })
    return yaml.load(lines.join("\n")) || {"new item": null}
  }

  update(i, data) {
    if (data) this.lines[i] = data
  }

  cleanLine(line) {
    var left = line.substr(0, line.indexOf(":"))
    var right = line.substr(line.indexOf(":"))
    right = right.replaceAll(": -", "")
    right = right.replaceAll(":", "")
    return `${left}:${right}`
  }

  normalizeDescription(line, spaces) {
    var separator = line.indexOf(':')
    if (separator < 0) return

    var description = line.slice(separator + 1).trim()
    if (!description || ['>-', '|-'].includes(description)) return

    return line.slice(0, separator) + ":\n" +
      " ".repeat(spaces) + "_: " + description
  }

}
