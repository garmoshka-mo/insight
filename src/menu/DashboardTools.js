import ComponentController from "../../utils/ComponentController";
import {showFlash} from "../commonFunctions";
import actionsSheetController from "../actionsSheetController";
import FilesList from "../FilesList";
import React from "../../utils/react-tuned";
import files from "../files";
import menuController from "./menuController";
import SettingsMenu from "./SettingsMenu";
import dashboard from "../dashboard";

export default class DashboardTools extends ComponentController {

  tools = [
    {icon: 'refresh', action: this.sync},
    {icon: 'bath', action: this.bath},
    {icon: 'cog', action: this.showSettings},
    {icon: 'folder-open', action: _=>
        actionsSheetController.open(<FilesList />)
    },
  ]

  async sync() {
    var refreshButton = this.tools.find(_ => _.icon=='refresh')
    refreshButton.disabled = true
    this.refresh()
    await files.sync()
    refreshButton.disabled = false
    this.refresh()
  }

  async bath() {
    showFlash('Test')


  }

  showSettings() {
    if (!this.settingsMenu) this.settingsMenu = new SettingsMenu()
    menuController.push(this.settingsMenu)
  }


}