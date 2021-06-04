/** @providesModule Undo
 **/

import diff from 'fast-diff'
import {logr} from "./commonFunctions";

export default class Undo {

  prev = []

  constructor(value) {
    this.history = [value]
  }

  undo() {
    if (this.history.length == 1) return this.history[0]
    this.prev = []
    this.history.pop()
    return this.current
  }

  get current() {
    return this.history[this.history.length - 1]
  }

  changed(value) {
    if (value.length == 0) return

    var [change, changedText] = diff(this.current, value)
      .find(_ => _[0] != diff.EQUAL)

    var [prevChange, prevText] = this.prev

    var add = this.history.length == 1 ||
      prevChange != change ||
      (changedText == ' ' && prevText != ' ') ||
      changedText.length > 1
    if (add)
      this.add(value, change)
    else
      this.history[this.history.length - 1] = value

    this.prev = [change, changedText]

    // logr('DIFF', change, changedText)
  }

  add(value, change) {
    logr('Text change added', value, change)
    this.history.push(value)
  }

}