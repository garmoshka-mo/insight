import ComponentController from "../../utils/ComponentController";
import menuController from "../menuController";
import auth from "../auth";

export default new class SettingsMenu extends ComponentController {

  init() {
    this.tools = [
      {icon: 'chevron-left', action: menuController.pop, left: true},

      {icon: 'sign-out', action: auth.logout},
    ]
  }


}