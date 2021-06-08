import ComponentController from "../../utils/ComponentController";
import menuController from "../menuController";

export default class NodeMoving extends ComponentController {

  init(node) {
    node.update({editing: false, moving: true})
    this.tools = [

      {icon: 'angle-double-up', action: _=> node.move(-1)},
      {icon: 'angle-double-down', action: _=> node.move(+1)},

      {icon: 'material/table-row-plus-after', action: node.addSibling},
      {icon: 'material/table-column-plus-after', action: node.addChild},

      {icon: 'check', left: true, action: _=> {
        node.update({moving: false})
        menuController.pop()
      }},

    ]
  }




}