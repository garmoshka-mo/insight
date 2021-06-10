import ComponentController from "../../utils/ComponentController";
import menuController from "./menuController";

export default class NodeMoving extends ComponentController {

  init(node) {
    node.update({editing: false, moving: true})
    this.tools = [

      {icon: 'angle-double-up', action: _=> node.move(-1)},
      {icon: 'angle-double-down', action: _=> node.move(+1)},

      {icon: 'check', left: true, action: _=> {
        node.update({moving: false})
        menuController.pop()
      }},

    ]
  }




}