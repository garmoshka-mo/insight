import ComponentController from "../../utils/ComponentController";
import menuController from "./menuController";
import dashboard from "../dashboard";

export default class MovingMenu extends ComponentController {

  init(node) {
    this.node = node
    node.update({editing: false, moving: true})
    this.tools = [

      {icon: 'angle-double-up', action: _=> node.move(-1)},
      {icon: 'angle-double-down', action: _=> node.move(+1)},

      {icon: 'material/arrow-top-right-thick', action: _=> node.moveToChild(-1)},
      {icon: 'material/arrow-bottom-right-thick', action: _=> node.moveToChild(+1)},

      {icon: 'check', left: true, action: menuController.pop},

    ]
  }

  onMenuPop() {
    this.node.update({moving: false})
    dashboard.save()
  }


}