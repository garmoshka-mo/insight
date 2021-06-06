/** @providesModule NodeComponent
 **/

import React, {Component} from "../utils/react-tuned"
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableHighlight,
  Appearance
} from 'react-native'
import styles, {colors} from './styles'
import Editor from './Editor'
import Icon from "react-native-vector-icons/FontAwesome"
import Swipeout from 'react-native-swipeout'
import menuController from "./menuController";

export default class NodeComponent extends Component {

  constructor(props) {
    super()
    var {node} = props
    this.node = node
    this.subscribeTo(node)
  }

  render() {
    return <View style={this.wrapStyle}>
      {this.header()}
      {this.renderSubItems()}
    </View>
  }

  get wrapStyle() {
    return {
      width: '100%',
      flexDirection:'row',
      paddingLeft: this.node.level > 1 ? 20 : 0,
      marginBottom: 4,
      flexWrap:'wrap'
    }
  }

  header() {
    if (this.node.editing)
      return <Editor parent={this} node={this.node} />

    return this.swipeable(<Text
      onPress={this.node.edit}
    >
      <Text
        onPress={this.toggle}
        style={{color: this.node.children.length == 0 ?
            '#8d7627' : '#2280a5'}}
      >
        {this.node.importanceEmoji}
        {this.node.name}
        {' '}
        {this.rightIcons}
        {' '}
      </Text>
      {this.renderDescription()}
    </Text>)
  }

  updateNode(key, value, neutral) {
    var state = {[key]: value}
    if (this.node[key] == value) state[key] = neutral
    this.node.update(state)
    menuController.refresh()
  }

  swipeable(content) {
    var {node} = this
    var left = [{
      text: '🔥',
      selected: node.importance == 'important',
      onPress: _=> this.updateNode('importance', 'important', 'normal')
    },{
      text: '❔',
      selected: node.importance == 'guess',
      onPress: _=> this.updateNode('importance', 'guess', 'normal')
    },{
      text: '⏩',
      selected: node.alwaysExpanded,
      onPress: _=> this.updateNode('alwaysExpanded', true, false)
    },

    ].map(props => ({
      ...props,
      backgroundColor: props.selected ? colors.selected : 'transparent',
    }))

    var right = [{
      text: '🚮',
      type: 'delete',
      onPress: node.delete
    }]

    return <Swipeout backgroundColor={'transparent'}
                     buttonWidth={40}
                     style={{width: '100%'}}
                     right={right} left={left}>
      {content}
    </Swipeout>
  }

  get rightIcons() {
    var {node} = this
    var icons = [node.expandedEmoji]
    if (!this.node.expanded) {
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
    if (this.node.expanded)
      return <Text
        style={styles.text}>
        {this.node.description || this.editIcon()}
      </Text>
  }

  editIcon() {
    return <Icon name={"edit"} size={14} style={styles.text} />
  }

  toggle() {
    if (!this.node.description && !this.node.children.length)
      return this.node.edit()

    this.node.update({expanded: !this.node.expanded})
  }

  renderSubItems() {
    var {node} = this
    if (!node.children.length) return
    if (!this.node.expanded) return
    return node.children.map(
      child => child.render()
    )
  }

}