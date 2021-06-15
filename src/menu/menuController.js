/** @providesModule menuController
 **/

import ComponentController from "../../utils/ComponentController"
import {BackHandler} from 'react-native'
import React from "../../utils/react-tuned";
import DashboardTools from "./DashboardTools";
import {showError} from "../errors";

export default new class extends ComponentController {

  stack = [new DashboardTools()]

  init() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  get head() {
    return this.stack.last()
  }

  switch(menuName) {
    this.update({_menu: this[menuName]})
  }

  push(tools, reset = false) {
    if (reset) {
      this.stack[1] = tools
      this.stack.length = 2
    } else
      this.stack.push(tools)
    this.refresh()
  }

  pop() {
    if (this.stack.length == 1)
      return showError('Trying to pop root menu')
    this.stack.pop().onMenuPop?.()
    this.refresh()
  }

  reset() {
    this.stack.length = 1
    this.refresh()
  }

  handleBack() {
    if (this.stack.length > 1) {
      this.pop()
      return true
    }
  }


}