/** @providesModule PlainItem
 **/

import React, {Component} from "../utils/react-tuned"
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,

} from 'react-native'

export default class PlainItem extends Component {

  titleColor = '#8d7627'
  state = {
    showDescription: true
  }

  constructor(props) {
    super()
    this.level = props.level || 0
    this.node = props.node
    this.subscribeTo(props.node)
  }

  render() {
    const containerStyle = {
      flexDirection:'row',
      marginLeft: this.level && 20,
      flexWrap:'wrap'
    }

    return <View style={containerStyle}>
      {this.header()}
      {this.renderSubItems()}
    </View>
  }

  header() {
    return <Text>
      <Text
        onPress={this.toggle}
        style={{color: this.titleColor}}
      >
        {this.node.name}
      </Text>
      <View style={{width: 5}}/>
      {this.node.description}
    </Text>
  }

  toggle() {
    this.setState({showDescription: !this.state.showDescription})
  }

  renderSubItems() {

  }

}