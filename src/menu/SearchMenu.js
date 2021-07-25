import ComponentController from "../../utils/ComponentController";
import menuController from "./menuController";
import files from "../files";
import {View, TextInput} from "react-native";
import MenuRow from "./MenuRow";
import React from "../../utils/react-tuned";
import dashboard from "../dashboard";

export default class SearchMenu extends ComponentController {

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
    dashboard.foundNodes = []
    pickNodes(dashboard.root, substr, dashboard.foundNodes)
    dashboard.refresh()
  }

}

function pickNodes(n, substr, result) {
  if (match(n.name, substr) || match(n.description, substr))
    result.push(n)
  n.children.each(child => pickNodes(child, substr, result))
}

function match(text, substr) {
  if (text)
    return text.toLowerCase().includes(substr.toLowerCase())
}
