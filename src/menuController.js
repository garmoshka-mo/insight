/** @providesModule menuController
 **/

import ComponentController from "./utils/ComponentController"
import {showFlash} from "./commonFunctions";
import files from "./files"
import auth from './auth'
import {Keyboard} from 'react-native'
import actionsSheetController from "./actionsSheetController";
import FilesList from "./FilesList";
import React from "../utils/react-tuned";
import DashboardTools from "./menu/DashboardTools";

export default new class extends ComponentController {

  constructor() {
    super()
    this.stack = [new DashboardTools()]
  }

  get currentTools() {
    return this.stack.last()
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
    this.stack.pop()
    this.refresh()
  }


}