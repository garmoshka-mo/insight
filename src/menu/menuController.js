/** @providesModule menuController
 **/

import ComponentController from "../../utils/ComponentController"
import {BackHandler} from 'react-native'
import React from "../../utils/react-tuned";
import DashboardTools from "./DashboardTools";

export default new class extends ComponentController {

  stack = [new DashboardTools()]

  init() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  get currentTools() {
    return this.stack.last().tools
  }

  switch(menuName) {
    this.update({_menu: this[menuName]})
  }

  push(tools) {
    this.stack.push(tools)
    this.refresh()
  }

  pop() {
    if (this.stack.length == 1) throw('Trying to pop root menu')
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