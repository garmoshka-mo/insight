/** @providesModule YamlView
 **/

import React, {Component} from "../utils/react-tuned"
import {FlatList} from 'react-native'
import YamlItem from './YamlItem'
import sample from './sampleData'
import _ from 'lodash'


export default class extends Component {
  constructor() {
    super()
    this.state = _.cloneDeep(sample)
  }

  render() {
    return <FlatList
      style={{marginTop: 40}}
      data={Object.keys(this.state)}
      keyExtractor={row => row}
      renderItem={this.renderItem}/>
  }

  renderItem(row) {
    var key = row.item
    return <YamlItem name={key} content={this.state[key]} />
  }
}