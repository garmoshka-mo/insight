/** @providesModule DashboardView
 **/

import React, {Component} from "../utils/react-tuned"
import {View, ActivityIndicator, FlatList, Dimensions} from 'react-native'
import ActionsSheetDialog from './ActionsSheetDialog'
import Menu from './menu/Menu'
import FlashMessage from "react-native-flash-message"
import dashboard from "./dashboard";
import {swipeController} from "../utils/ComponentController";
import FoundNodeComponent from "./node/FoundNodeComponent";
import searchMenu from "./menu/searchMenu";
import NodesList from "./views/NodesList";
import SearchView from "./views/SearchView";

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

    return dashboard.routes.last()
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

}