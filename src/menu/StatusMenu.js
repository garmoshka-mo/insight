/** @providesModule StatusMenu
 **/

import React, {Component} from "../../utils/react-tuned"
import menuController from "./menuController";
import MenuRow from "./MenuRow";


export default class StatusMenu extends Component {

  node = this.props.node

  render() {
    var {node} = this
    return <MenuRow size={.8} controller={node} buttons={[
      {emoji: `🔥`, selected: _=> node.importance == 'important',
        action: _=> this.updateNode('importance', 'important', 'normal')},
      {emoji: `❔`, selected: _=> node.importance == 'guess',
        action: _=> this.updateNode('importance', 'guess', 'normal')},
      {emoji: `⏩`, selected: _=> node.alwaysExpanded,
        action: _=> this.updateNode('alwaysExpanded', true, false)},
    ]} />
  }

  updateNode(...args) {
    this.node.updateFlag(...args)
    menuController.refresh()
  }

}