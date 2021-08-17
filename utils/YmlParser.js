/** @providesModule YmlParser
 **/

import yaml from 'js-yaml'

export default class YmlParser {

  static parse(content) {
    var lines = content.replace(/\t/g, '  ').split("\n")
    var prevLine, prevSpaces = 0
    lines.forEach((line, i) => {
      var m = line.match(/^(\s*)/)
      var spaces = m ? m[1].length : 0
      if (prevSpaces < spaces) {
        var ke = this.pup(prevLine, spaces)
        if (ke) lines[i - 1] = ke
      }
      prevLine = line
      prevSpaces = spaces
    })
    return yaml.load(lines.join("\n"))
  }

  static pup(line, spaces) {
    var separator = line.indexOf(':')
    if (separator < 0) return

    var description = line.slice(separator + 1).trim()
    if (!description || ['>-'].includes(description)) return

    return line.slice(0, separator) + ":\n" +
      " ".repeat(spaces) + "_: " + description
  }

}
