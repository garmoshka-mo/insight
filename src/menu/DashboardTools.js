import ComponentController from "../../utils/ComponentController";
import {showFlash} from "../commonFunctions";
import actionsSheetController from "../actionsSheetController";
import FilesList from "../FilesList";
import React from "../../utils/react-tuned";
import files from "../files";
import menuController from "./menuController";
import SettingsMenu from "./SettingsMenu";
import SearchMenu from "./SearchMenu";

export default class DashboardTools extends ComponentController {

  tools = [
    this.syncButton,
    {icon: 'search', action: this.showSearch},
    {icon: 'bath', action: this.bath},
    {icon: 'cog', action: this.showSettings},
    {icon: 'folder-open', action: _=>
        actionsSheetController.open(<FilesList />)
    },
  ]

  get syncButton() {
    var button = {icon: 'refresh', action: async _=> {
        button.disabled = true
        this.refresh()
        await files.sync()
        button.disabled = false
        this.refresh()
    }}
    return button
  }

  async bath() {
    showFlash('Test')


  }

  showSettings() {
    if (!this.settingsMenu) this.settingsMenu = new SettingsMenu()
    menuController.push(this.settingsMenu)
  }

  showSearch() {
    menuController.push(new SearchMenu())
  }


}