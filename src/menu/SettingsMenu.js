import ComponentController from "../../utils/ComponentController";
import menuController from "./menuController";
import auth from "../auth";

export default class SettingsMenu extends ComponentController {

  init() {
    this.tools = [
      {icon: 'chevron-left', action: menuController.pop, left: true},

      {icon: 'sign-out', action: auth.logout},
    ]
  }


}