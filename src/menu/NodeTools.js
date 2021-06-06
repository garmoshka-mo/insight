import ComponentController from "../../utils/ComponentController";
import menuController from "../menuController";

export default class NodeTools extends ComponentController {

  init(node) {
    this.node = node
    this.tools = [
      {icon: 'chevron-left', left: true, action: _=> {
        node.update({editing: false})
        menuController.pop()
      }},

      {icon: 'angle-double-up', action: _=> node.move(-1)},
      {icon: 'angle-double-down', action: _=> node.move(+1)},

      {icon: 'material/table-row-plus-after', action: node.addSibling},
      {icon: 'material/table-column-plus-after', action: node.addChild},

      {icon: 'trash', action: node.delete},

      {icon: `emoji:🔥`, selected: node.importance == 'important',
        action: this.updateNode({importance: 'important'})},
      {icon: `emoji:❔`, selected: node.importance == 'guess',
        action: this.updateNode({importance: 'guess'})},
      {icon: `emoji:⏩`, selected: node.expanded,
        action: this.updateNode({expanded: !node.expanded})},
    ]
  }

  updateNode() {
    this.node.update(state)
    this.refresh()
  }


}