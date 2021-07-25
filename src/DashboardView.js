/** @providesModule Dashboard
 **/

import React, {Component} from "../utils/react-tuned"
import {View, ActivityIndicator, FlatList, Dimensions} from 'react-native'
import ActionsSheetDialog from './ActionsSheetDialog'
import Menu from './menu/Menu'
import FlashMessage from "react-native-flash-message"
import dashboard from "./dashboard";
import {swipeController} from "../utils/ComponentController";
import FoundNodeComponent from "./node/FoundNodeComponent";

export default class extends Component {

  controllers = [dashboard, swipeController]

  componentDidMount() {
    dashboard.loadDashboard()
  }

  render() {
    return <View style={{flex: 1}}>
      {this.content()}
      <Menu />
      <FlashMessage position="top" />
      <ActionsSheetDialog />
    </View>
  }

  content() {
    if (!dashboard.root) return this.preloader()

    return <FlatList
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 15,
        paddingBottom: Dimensions.get('window').height / 2
      }}
      scrollEnabled={!swipeController.swipeStarted}
      keyboardShouldPersistTaps="always"
      data={dashboard.dataSource}
      keyExtractor={item => item.name}
      renderItem={this.renderItem}/>
  }

  preloader() {
    return <View style={{flex: 1}}>
      <ActivityIndicator
        style={{
          top: 0,
          bottom: 0,
          position: 'absolute',
          left: 0,
          right: 0
        }}
        size="large"
        color='white'
      />
    </View>
  }

  renderItem(row) {
    if (dashboard.foundNodes)
      return <FoundNodeComponent key={this.name} node={this} />
    else
      return row.item.render()
  }
}