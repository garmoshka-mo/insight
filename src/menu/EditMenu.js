/** @providesModule EditMenu
 **/

import React, {Component} from "../../utils/react-tuned"
import {
  Text,
  TextInput,
  View,
  Alert,
  Appearance
} from 'react-native'
import menuController from "./menuController";
import MenuRow from "./MenuRow";
import {showFlash} from "../commonFunctions";


export default class {

  constructor(node, editor) {
    this.node = node

    this.tools = <View style={{flexDirection: 'column'}}>
      <View style={{flexDirection: 'row', paddingBottom: 10}}>
        <MenuRow size={.8} controller={node} buttons={[
          {icon: `emoji:🔥`, selected: _=> node.importance == 'important',
            action: _=> this.updateNode('importance', 'important', 'normal')},
          {icon: `emoji:❔`, selected: _=> node.importance == 'guess',
            action: _=> this.updateNode('importance', 'guess', 'normal')},
          {icon: `emoji:⏩`, selected: _=> node.alwaysExpanded,
            action: _=> this.updateNode('alwaysExpanded', true, false)},
        ]} />
        <MenuRow size={.8} buttons={[
          {action: this.parseSubItems, icon: 'list-alt'},
          {action: node.addSibling, icon: 'material/table-row-plus-after'},
          {action: node.addChild, icon: 'child'},
        ]} style={{flex: 1, justifyContent: "flex-end"}} />
      </View>
      <View style={{flexDirection: 'row'}}>
        <MenuRow size={.8} buttons={[
          {action: menuController.pop, icon: 'chevron-left', left: true},
          {icon: 'undo', action: editor.doUndo},
          {action: editor.split, icon: 'ellipsis-v'},
          {action: editor.save, icon: 'check'}
        ]} />
      </View>
    </View>
    menuController.push(this)
  }

  onMenuPop() {
    this.node.update({editing: false})
  }

  updateNode(...args) {
    this.node.updateFlag(...args)
    menuController.refresh()
  }

  parseSubItems() {

    showFlash('ToDo')
  }

}