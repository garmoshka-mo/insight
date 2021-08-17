/** @providesModule NodeMenu
 **/

import React, {Component} from "../../utils/react-tuned"
import {
  Text,
  TextInput,
  View,
  Alert, Clipboard,
} from 'react-native'
import menuController from "./menuController";
import MenuRow from "./MenuRow";
import StatusMenu from "./StatusMenu";
import dashboard from "../dashboard";


export default class NodeMenu {

  onHide = null

  constructor(node) {
    this.node = node
    var style = {flexDirection: 'row', paddingBottom: 20, justifyContent: 'center'}

    this.tools = <View style={{flexDirection: 'column'}}>
      <View style={style}>
        <StatusMenu node={node}/>
      </View>
      <View style={style}>
        {this.movingMenu()}
      </View>
      <View style={style}>
        {this.bottomMenu()}
      </View>
    </View>
    menuController.push(this)
  }

  movingMenu() {
    var {node} = this
    return <MenuRow buttons={[
      {action: _=> node.move(-1), icon: 'angle-double-up'},
      {action: _=> node.move(+1), icon: 'angle-double-down'},
      {action: _=> node.moveToChild(-1), icon: 'material/arrow-top-right-thick'},
      {action: _=> node.moveToChild(+1), icon: 'material/arrow-bottom-right-thick'},
      {action: menuController.pop, icon: 'check'},
    ]} />
  }

  bottomMenu() {
    var {node} = this
    return <MenuRow size={.8} buttons={[
      {action: menuController.pop, icon: 'times-circle-o', left: true},

      {action: this.copy, icon: 'copy'},

      {action: _=> node.editSibling(-1), icon: 'material/table-row-plus-before'},
      {action: _=> node.editSibling(+1), icon: 'material/table-row-plus-after'},
      {action: node.editChild, icon: 'child'},

      {action: node.delete, emoji: '🚮'},
    ]} />
  }

  copy() {
    Clipboard.setString(this.node.name)
  }

  onMenuPop() {
    this.onHide?.()
    dashboard.save()
  }

}