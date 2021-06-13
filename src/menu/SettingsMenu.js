import ComponentController from "../../utils/ComponentController";
import menuController from "./menuController";
import auth from "../auth";
import files from "../files";

export default class SettingsMenu extends ComponentController {

  init() {
    this.tools = [
      {icon: 'chevron-left', action: menuController.pop, left: true},

      {icon: 'material/restart-alert', action: files.resetFiles},
      {icon: 'sign-out', action: auth.logout},
    ]
  }


}