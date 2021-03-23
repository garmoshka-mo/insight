/** @providesModule YamlView
 **/

import React, {Component} from "../utils/react-tuned"
import {FlatList} from 'react-native'
import YamlItem from './YamlItem'
import sample from './sampleData'

export default class extends Component {

  constructor() {
    super()
    this.state = sample
  }

  render() {
    return <FlatList
      style={{marginTop: 40, margin: 10}}
      data={Object.keys(this.state)}
      keyExtractor={row => row.item}
      renderItem={this.renderItem}/>
  }

  renderItem(row) {
    var key = row.item
    return <YamlItem name={key} content={this.state[key]} />
  }
}