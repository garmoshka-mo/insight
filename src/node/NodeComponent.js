/** @providesModule NodeComponent
 **/

import React, {Component} from "../../utils/react-tuned"
import {
  Animated,
  Text,
  View,
} from 'react-native'
import styles, {colors} from '../styles'
import Editor from '../Editor'
import Icon from "react-native-vector-icons/FontAwesome"
import Hyperlink from 'react-native-hyperlink'
import linking from '../linking'
import NodeMenu from "../menu/NodeMenu";

export default class NodeComponent extends Component {

  state = {}

  constructor(props) {
    super()
    var {node} = props
    this.node = node
    this.node.backgroundAnim = new Animated.Value(0)
    this.subscribeTo(node)
  }

  render() {
    return <View style={this.wrapStyle}>
      {this.body()}
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

  body() {
    var {node} = this
    if (node.editing)
      return <Editor parent={this} node={node} />

    if (this.state.highlight) var style = {
      borderWidth: 2, borderColor: '#00dbff40',
      borderRadius: 10}

    var backgroundColor = this.node.backgroundAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(0, 0, 0, 0)', 'rgb(20,212,255)']
    })

    return <Animated.View
      style={{width: '100%', backgroundColor}}
      collapsable={false}
      ref={ref => this.node.viewRef = ref}
      onTouchStart={ e => this.touchStartX = e.nativeEvent.locationX}
    >
      <Hyperlink
        linkDefault
        linkStyle={ { color: colors.link } }
        linkText={ url => 'link' }
      >
        <Text
          onPress={this.pressBody}
          onLongPress={this.showTools}
          style={style}
        >
          {this.header()}
          {this.renderDescription()}
        </Text>
      </Hyperlink>
    </Animated.View>
  }

  header() {
    var {node} = this
    return <Text
      onPress={this.pressHeader}
      onLongPress={this.showTools}
      style={this.headerStyle}
    >
      {node.importanceEmoji}
      {node.name}
      {' '}
      {this.rightIcons}
      {' '}
    </Text>
  }

  get headerStyle() {
    var color = '#4495ae' // '#ab902f'
    if (this.importance == 'archived') color = '#7c7c7c'
    return {color}
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

  pressBody(e) {
    if (this.swipe(e)) return
    if (linking.capture(this)) return
    if (!this.node.expanded && this.hasContent)
      return this.node.update({expanded: true})
    this.node.edit()
  }

  pressHeader(e) {
    if (this.swipe(e)) return
    if (linking.capture(this)) return
    if (!this.hasContent) return this.node.edit()

    this.node.update({expanded: !this.node.expanded})
  }

  showTools() {
    var menu = new NodeMenu(this.node)
    menu.onHide = _=> this.setState({highlight: false})
    this.setState({highlight: true})
  }

  swipe(e) {
    if (Math.abs(this.touchStartX - e.nativeEvent.locationX) > 20) {
      this.showTools()
      return true
    }
  }
  
  get hasContent() {
    return this.node.description || this.node.children.length
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