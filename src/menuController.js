/** @providesModule menuController
 **/

import ComponentController from "../utils/ComponentController"
import React from "../utils/react-tuned";
import DashboardTools from "./menu/DashboardTools";

export default new class extends ComponentController {

  stack = [new DashboardTools()]

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
    this.stack.pop()
    this.refresh()
  }


}