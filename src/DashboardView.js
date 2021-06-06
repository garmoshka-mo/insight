/** @providesModule Dashboard
 **/

import React, {Component} from "../utils/react-tuned"
import {View, ActivityIndicator, FlatList} from 'react-native'
import ActionsSheetDialog from './ActionsSheetDialog'
import Menu from './Menu'
import FlashMessage from "react-native-flash-message"
import dashboard from "./dashboard";

export default class extends Component {

  controllers = [dashboard]

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
      contentContainerStyle={{paddingHorizontal: 8,
        paddingVertical: 15}}
      keyboardShouldPersistTaps="always"
      data={dashboard.root.children}
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
    return row.item.render()
  }
}