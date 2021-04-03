/** @providesModule YamlView
 **/

import React, {Component} from "../utils/react-tuned"
import {View, Button, FlatList} from 'react-native'
import YamlItem from './YamlItem'
import sample from './sampleData'
import _ from 'lodash'
import YamlNode from "./YamlNode"

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
    return <View style={{height: 40}}>
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
      keyExtractor={row => row.item.name}
      renderItem={this.renderItem}/>
  }

  renderItem(row) {
    return <YamlItem node={row.item} />
  }
}