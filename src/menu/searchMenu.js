/** @providesModule searchMenu
 **/

import ComponentController from "../../utils/ComponentController";
import menuController from "./menuController";
import {View, TextInput} from "react-native";
import MenuRow from "./MenuRow";
import React from "../../utils/react-tuned";
import dashboard from "../dashboard";
import {strMatch} from "../commonFunctions";
import services from "../services";

const searchMenu = new class SearchMenu extends ComponentController {

  init() {
    this.tools = <View style={{flexDirection: 'row'}}>
      <MenuRow size={.8} buttons={[
        {action: menuController.pop, icon: 'times-circle-o', left: true},
      ]} />
      <TextInput
        autoFocus={true}
        onChangeText={this.search}
      />
    </View>
  }

  search(substr) {
    this.foundNodes = []
    this.searchString = substr
    if (substr.length >= 2)
      pickNodes(dashboard.root, substr, this.foundNodes)
    dashboard.refresh()
  }

  onShow() {
    dashboard.update({show: 'foundNodes'})
  }

  onMenuPop() {
    dashboard.update({show: 'nodesTree'})
  }

}

services.searchMenu = searchMenu
export default searchMenu

function pickNodes(n, substr, result) {
  if (strMatch(n.name, substr) || strMatch(n.description, substr))
    result.push(n)
  n.children.each(child => pickNodes(child, substr, result))
}

