/** @providesModule SearchView
 **/

import React, {Component} from "../../utils/react-tuned"
import {View, ActivityIndicator, FlatList, Dimensions} from 'react-native'
import Menu from '../menu/Menu'
import FlashMessage from "react-native-flash-message"
import dashboard from "../dashboard";
import {swipeController} from "../../utils/ComponentController";
import searchMenu from "../menu/searchMenu";
import FoundNodeComponent from "../node/FoundNodeComponent";

export default class extends Component {

  constructor(props) {
    super()
    this.subscribeTo(props.controller)
  }

  render() {
    return <FlatList
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 15,
        flexGrow: 1,
        justifyContent: 'flex-end',
      }}
      keyboardShouldPersistTaps="always"
      data={this.props.controller.foundNodes}
      keyExtractor={item => item.name}
      renderItem={({item}) => {
        var node = item
        return <FoundNodeComponent key={node.name} node={node} />
      }}/>
  }


}