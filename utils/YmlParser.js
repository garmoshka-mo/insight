/** @providesModule YmlParser
 **/

import yaml from 'js-yaml'

export default class YmlParser {

  static parse(content) {
    return new this(content).parse()
  }

  constructor(content) {
    this.initial_yaml = content.replace(/\t/g, '  ')
    this.lines = this.initial_yaml.split("\n")
  }

  parse() {
    this.result_yaml = this.normalizeLines().join("\n")
    this.result = yaml.load(this.result_yaml) || {"new item": null}
    return this.result
  }

  normalizeLines() {
    var {lines} = this
    var prevLine, prevSpaces = 0, isDescriptionSection
    lines.forEach((line, i) => {
      var m = line.match(/^(\s*)/)
      var spaces = m ? m[1].length : 0

      if (!line.trim()) return
      if (isDescriptionSection && spaces < prevSpaces)
        isDescriptionSection = false

      if (false && i+1 == 57) console.log('ℹ️  Line:', line,
          isDescriptionSection, spaces, prevSpaces
        )

      if (!isDescriptionSection) {
        // Normalize list items - add ":" in the end
        if (!line.includes(":")) {
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
      }

      prevLine = line
      prevSpaces = spaces
      isDescriptionSection = isDescriptionSection ||
        !!line.match(/: >-$/)
    })
    return lines
  }

  update(i, data) {
    if (data) this.lines[i] = data
  }

  cleanLine(line) {
    var left = line.substr(0, line.indexOf(":"))
    var right = line.substr(line.indexOf(":") + 1)
    right = right.replace(/^\s-/, "") // fix of first ": -"
    right = right.replaceAll(": -", "")
    right = right.replaceAll(": ", "")
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
