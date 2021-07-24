import ComponentController from "../../utils/ComponentController";
import menuController from "./menuController";
import files from "../files";
import {View, TextInput} from "react-native";
import MenuRow from "./MenuRow";
import React from "../../utils/react-tuned";

export default class SearchMenu extends ComponentController {

  init() {
    this.tools = <View style={{flexDirection: 'row'}}>
      <MenuRow size={.8} buttons={[
        {action: menuController.pop, icon: 'times-circle-o', left: true},
      ]} />
      <TextInput
        autoFocus={true}
        value={"Test value"}
        onChangeText={this.search}
      />
    </View>
  }

  search(text) {

  }


}