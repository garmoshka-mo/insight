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
import Icon from "react-native-vector-icons/FontAwesome"
import actionsSheetController from "./actionsSheetController";

export default class PlainItem extends Component {

  titleColor = '#8d7627'

  constructor(props) {
    super()
    var {node} = props
    this.state = {
      expanded: node.expanded || node.isNew
    }
    this.node = node
    this.subscribeTo(node)
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
    if (this.node.editing)
      return <Editor parent={this} node={this.node} />

    return <Text
      onPress={this.node.edit}
    >
      <Text
        onPress={this.toggle}
        style={{color: this.titleColor}}
      >
        {this.node.importanceEmoji}
        {this.node.name}
        {' '}
        {this.rightIcons}
        {' '}
      </Text>
      {this.renderDescription()}
    </Text>
  }

  get rightIcons() {
    var {node} = this
    var icons = [node.expandedEmoji]
    if (!this.state.expanded) {
      if (node.children.length > 0)
        icons.push(<Icon key='list' name={"list"}>
          {' ' + node.children.length}
        </Icon>)
      else if (!node.expandedEmoji && node.description)
        icons.push(<Icon key='note' name={"sticky-note"}/>)
    }
    return icons
  }

  renderDescription() {
    if (this.state.expanded)
      return <Text
        style={styles.text}>
        {this.node.description || this.editIcon()}
      </Text>
  }

  editIcon() {
    return <Icon name={"edit"} size={14} style={styles.text} />
  }

  toggle() {
    if (this.node.description)
      this.setState({expanded: !this.state.expanded})
    else
      this.node.edit()
  }

  renderSubItems() {

  }

}