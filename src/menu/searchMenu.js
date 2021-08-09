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
import SearchView from "../views/SearchView";

const searchMenu = new class SearchMenu extends ComponentController {

  init() {
    this.searchView = <SearchView controller={this}/>
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
    this.refresh()
  }

  onShow() {
    dashboard.routes.push(this.searchView)
    dashboard.refresh()
  }

  onMenuPop() {
    dashboard.routes.pop()
    dashboard.refresh()
  }

}

services.searchMenu = searchMenu
export default searchMenu

function pickNodes(n, substr, result) {
  if (strMatch(n.name, substr) || strMatch(n.description, substr))
    result.push(n)
  n.children.each(child => pickNodes(child, substr, result))
}

