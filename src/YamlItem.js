/** @providesModule YamlItem
 **/

import React, {Component} from "../utils/react-tuned"
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,

} from 'react-native'

export default class YamlItem extends Component {

  state = {
    showSubItems: true
  }
  subItems = null

  constructor(props) {
    super()
    this.level = props.level || 0
    this.parseContent(props)
  }

  render() {
    var style = {
      flexDirection:'row',
      marginLeft: this.level && 20,
      flexWrap:'wrap'
    }

    return <View style={style}>
      {this.header()}
      {this.renderSubItems()}
    </View>
  }

  parseContent(props) {
    var {content} = props
    if (typeof content == 'string') {
      this.details = content
      return
    }

    if (content["_"]) {
      this.details = content["_"]
    }
    this.subItems = content
  }

  header() {
    var hasSubItems = '#2280a5'
    var plainItem = '#8d7627'
    var color = this.subItems ? hasSubItems :plainItem

    return <Text>
        <Text
          onPress={this.toggle}
          style={{color}}
        >
          {this.props.name}
        </Text>
        <View style={{width: 5}}/>
        {this.details}
    </Text>
  }

  toggle() {
    this.setState({showSubItems: !this.state.showSubItems})
  }

  renderSubItems() {
    var result = [], {subItems} = this
    if (!subItems || !this.state.showSubItems) return
    for (const key in subItems) {
      if (["_"].includes(key)) continue
      result.push(<YamlItem
        name={key}
        level={this.level + 1}
        content={subItems[key]}
      />)
    }
    return result
  }

}