/** @providesModule NodeMenu
 **/

import React, {Component} from "../../utils/react-tuned"
import {
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native'
import menuController from "./menuController";
import MenuRow from "./MenuRow";
import StatusMenu from "./StatusMenu";
import NodeTools from "../node/NodeTools";
import dashboard from "../dashboard";


export default class {

  onHide = null

  constructor(node) {
    this.node = node

    this.tools = <View style={{flexDirection: 'column'}}>
      <View style={{flexDirection: 'row', paddingBottom: 10}}>
        <StatusMenu node={node}/>
      </View>
      <View style={{flexDirection: 'row', paddingBottom: 10}}>
        {this.movingMenu()}
      </View>
      <View style={{flexDirection: 'row'}}>
        <NodeTools node={node} />
      </View>
    </View>
    menuController.push(this)
  }

  movingMenu() {
    var {node} = this
    return <MenuRow size={.8} buttons={[
      {action: _=> node.move(-1), icon: 'angle-double-up'},
      {action: _=> node.move(+1), icon: 'angle-double-down'},
      {action: _=> node.moveToChild(-1), icon: 'material/arrow-top-right-thick'},
      {action: _=> node.moveToChild(+1), icon: 'material/arrow-bottom-right-thick'},
      {action: menuController.pop, icon: 'check'},
    ]} style={{flex: 1, justifyContent: "flex-end"}} />
  }

  onMenuPop() {
    this.onHide?.()
    dashboard.save()
  }

}