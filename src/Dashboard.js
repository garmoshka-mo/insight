/** @providesModule Dashboard
 **/

import React, {Component} from "../utils/react-tuned"
import {View, Button, FlatList} from 'react-native'
import sample from './sampleData'
import _ from 'lodash'
import YamlNode from "./YamlNode"
import Dropbox from "./Dropbox";

export default class extends Component {

  constructor() {
    super()
    this.root = new YamlNode('root', _.cloneDeep(sample))
  }

  render() {
    return <View>
      {this.topPanel()}
      {this.content()}
    </View>
  }

  topPanel() {
    return <View style={{}}>
      <Dropbox />
      <Button
        title="Test"
        onPress={_ => console.log('test')}
      />
    </View>
  }

  content() {
    return <FlatList
      style={{marginTop: 4, margin: 10}}
      data={this.root.children}
      keyExtractor={item => item.name}
      renderItem={this.renderItem}/>
  }

  renderItem(row) {
    return row.item.render()
  }
}