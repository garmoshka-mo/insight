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

const PREFIX_EMOJI = ['⏸', '⛔', '☣️']

export default class {

  constructor(node, editor) {
    this.node = node
    this.editor = editor

    this.tools = <View style={{flexDirection: 'column'}}>
      <View style={{flexDirection: 'row', justifyContent: "flex-end", paddingBottom: 10}}>
        <MenuRow size={.8} buttons={
          PREFIX_EMOJI.map(emoji =>
            ({action: _=> editor.insertPrefix(emoji), emoji})
          )
         } style={{flex: 1, justifyContent: "flex-end"}} />
      </View>
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
          {action: editor.close, icon: 'times-circle-o', left: true},
          {action: editor.doUndo, icon: 'undo'},
          {action: editor.split, icon: 'ellipsis-v'},
          {action: editor.paste, icon: 'paste'},
          {action: editor.close, icon: 'check'}
        ]} />
        <MenuRow size={.8} buttons={[
          {action: node.delete, icon: 'trash'}
        ]} style={{flex: 1, justifyContent: "flex-end"}} />
      </View>
    </View>
    menuController.push(this)
  }

  onMenuPop() {
    this.editor.close()
  }

  editSibling(dir) {
    this.editor.save()
    this.node.editSibling(dir)
  }

}