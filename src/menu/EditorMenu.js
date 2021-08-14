/** @providesModule EditorMenu
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
import StatusMenu from "./StatusMenu";


export default class {

  constructor(node, editor) {
    this.node = node
    this.editor = editor

    this.tools = <View style={{flexDirection: 'column'}}>
      <View style={{flexDirection: 'row', paddingBottom: 10}}>
        <StatusMenu node={node}/>
        <MenuRow size={.8} buttons={[
          {action: editor.parseSubItems, icon: 'list-alt'},
          {action: _=> this.editSibling(-1), icon: 'material/table-row-plus-before'},
          {action: _=> this.editSibling(+1), icon: 'material/table-row-plus-after'},
          {action: node.editChild, icon: 'child'},
        ]} style={{flex: 1, justifyContent: "flex-end"}} />
      </View>
      <View style={{flexDirection: 'row'}}>
        <MenuRow size={.8} buttons={[
          {action: menuController.pop, icon: 'times-circle-o', left: true},
          {icon: 'undo', action: editor.doUndo},
          {action: editor.split, icon: 'ellipsis-v'},
          {action: editor.paste, icon: 'paste'},
          {action: editor.save, icon: 'check'}
        ]} />
        <MenuRow size={.8} buttons={[
          {action: node.delete, icon: 'trash'}
        ]} style={{flex: 1, justifyContent: "flex-end"}} />
      </View>
    </View>
    menuController.push(this)
  }

  onMenuPop() {
    if (!this.editor.cancelNewNode())
      this.node.update({editing: false})
  }

  editSibling(dir) {
    this.editor.save()
    this.node.editSibling(dir)
  }

}