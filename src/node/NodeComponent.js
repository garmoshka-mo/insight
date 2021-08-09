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
import NodeTools from './NodeTools'
import linking from '../linking'
import actionsSheetController from "../actionsSheetController";

export default class NodeComponent extends Component {

  state = {}

  constructor(props) {
    super()
    var {node} = props
    this.node = node
    this.subscribeTo(node)
  }

  render() {
    return <Animated.View style={this.wrapStyle}
                 renderToHardwareTextureAndroid={true}
                 ref={ref => this.node.viewRef = ref}>
      {this.body()}
      {this.renderSubItems()}
    </Animated.View>
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

    if (node.moving || this.state.showTools) var style = {
      borderWidth: 2, borderColor: '#00dbff40',
      borderRadius: 10}

    return <View
      style={{width: '100%'}}
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
    </View>
  }

  header() {
    var {node} = this
    return <Text
      onPress={this.pressHeader}
      onLongPress={this.showTools}
      style={{color:
          '#4495ae'
        // '#ab902f'
      }}
    >
      {node.importanceEmoji}
      {node.name}
      {' '}
      {this.rightIcons}
      {' '}
    </Text>
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
    actionsSheetController.open(
      <NodeTools node={this.node} onHide={_=> this.setState({showTools: false})}/>
    )
    this.setState({showTools: true})
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