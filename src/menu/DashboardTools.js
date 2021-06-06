import ComponentController from "../../utils/ComponentController";
import {showFlash} from "../commonFunctions";
import actionsSheetController from "../actionsSheetController";
import FilesList from "../FilesList";
import React from "../../utils/react-tuned";
import files from "../files";
import menuController from "../menuController";
import SettingsMenu from "./SettingsMenu";

export default class DashboardTools extends ComponentController {

  tools = [
    {icon: 'refresh', action: this.sync},
    {icon: 'bath', action: _=> showFlash('Test')},
    {icon: 'cog', action: this.showSettings},
    {icon: 'folder-open', action: _=>
        actionsSheetController.open(<FilesList />)
    },
  ]

  async sync() {
    var refreshButton = this.dashboard.find(_ => _.icon=='refresh')
    refreshButton.disabled = true
    this.refresh()
    await files.sync()
    refreshButton.disabled = false
    this.refresh()
  }

  showSettings() {
    if (!this.settingsMenu) this.settingsMenu = new SettingsMenu()
    menuController.push(this.settingsMenu)
  }


}