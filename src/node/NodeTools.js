import React, {Component} from "../../utils/react-tuned";
import {Text, View, TouchableOpacity, Clipboard} from "react-native";
import menuController from "../menu/menuController";
import MenuRow from "../menu/MenuRow";

export default class NodeTools extends Component {

  node = this.props.node

  render() {
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

}