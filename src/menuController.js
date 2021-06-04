/** @providesModule menuController
 **/

import ComponentController from "./ComponentController"
import filesService from "./files";
import {showFlash} from "./commonFunctions";
import files from "./files"
import auth from './auth'
import {Keyboard} from 'react-native'
import actionsSheetController from "./actionsSheetController";
import FilesList from "./FilesList";
import React from "../utils/react-tuned";

export default new class extends ComponentController {

  constructor() {
    super()
    Keyboard.addListener('keyboardDidHide',
        _=> this.switch('dashboard')
    )
  }

  get menu() {
    if (!this._menu) this._menu = this.dashboard
    return this._menu
  }

  switch(menuName) {
    this.update({_menu: this[menuName]})
  }

  set(menu) {
    this.update({_menu: menu})
  }

  get dashboard() {
    return [
      {icon: 'refresh', action: filesService.sync},
      {icon: 'bath', action: _=> showFlash('Test')},
      {icon: 'folder-open', action: _=>
          actionsSheetController.open(<FilesList />)
      },
      // {icon: 'sign-out', action: auth.logout},
    ]
  }

}