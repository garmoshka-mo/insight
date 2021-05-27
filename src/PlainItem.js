/** @providesModule PlainItem
 **/

import React, {Component} from "../utils/react-tuned"
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Appearance
} from 'react-native'
import styles from './styles'
import Editor from './Editor'
import actionsSheetController from "./actionsSheetController";

export default class PlainItem extends Component {

  titleColor = '#8d7627'

  state = {
    showDescription: true
  }

  constructor(props) {
    super()
    this.node = props.node
    this.subscribeTo(props.node)
  }

  get wrapStyle() {
    return {
      flexDirection:'row',
      marginLeft: this.node.level > 1 ? 20 : 0,
      marginBottom: 4,
      flexWrap:'wrap'
    }
  }

  render() {
    return <View style={this.wrapStyle}>
      {this.header()}
      {this.renderSubItems()}
    </View>
  }

  header() {
    if (this.state.editing)
      return <Editor parent={this} node={this.node} />

    return <Text
      onPress={this.edit}
    >
      <Text
        onPress={this.toggle}
        style={{color: this.titleColor}}
      >
        {this.node.name}
      </Text>
      <View style={{width: 10}}/>
      <Text
        style={{color: styles.textColor}}>
        {this.node.description}
      </Text>
    </Text>
  }

  toggle() {
    this.setState({showDescription: !this.state.showDescription})
  }

  edit() {
    this.setState({editing: true})
  }

  renderSubItems() {

  }

}