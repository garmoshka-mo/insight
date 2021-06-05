import ComponentController from "../../utils/ComponentController";
import {showFlash} from "../commonFunctions";
import actionsSheetController from "../actionsSheetController";
import FilesList from "../FilesList";
import React from "../../utils/react-tuned";
import files from "../files";

export default class DashboardTools extends ComponentController {

  tools = [
    {icon: 'refresh', action: this.sync},
    {icon: 'bath', action: _=> showFlash('Test')},
    {icon: 'folder-open', action: _=>
        actionsSheetController.open(<FilesList />)
    },
    // {icon: 'sign-out', action: auth.logout},
  ]

  async sync() {``
    var refreshButton = this.dashboard.find(_ => _.icon=='refresh')
    refreshButton.disabled = true
    this.refresh()
    await files.sync()
    refreshButton.disabled = false
    this.refresh()
  }

  showTools() {
    this.update({show: true})
  }


}