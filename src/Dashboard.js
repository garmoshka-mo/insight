/** @providesModule Dashboard
 **/

import React, {Component} from "../utils/react-tuned"
import {View, ActivityIndicator, FlatList} from 'react-native'
import sample from './sampleData'
import _ from 'lodash'
import YamlNode from "./YamlNode"
import auth from "./auth"
import ActionsSheetDialog from './ActionsSheetDialog'
import Menu from './Menu'
import FlashMessage from "react-native-flash-message"
import viewport from "./viewport";

export default class extends Component {

  constructor() {
    super()
    this.subscribeTo(viewport)
  }

  componentDidMount() {
    auth.load()
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
    if (!viewport.root) return this.preloader()

    return <FlatList
      contentContainerStyle={{paddingHorizontal: 8,
        paddingVertical: 15}}
      data={viewport.root.children}
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