/** @providesModule FoundNodeComponent
 **/

import React, {Component} from "../../utils/react-tuned"
import {
  Text,
  View,
} from 'react-native'
import styles, {colors} from '../styles'
import Editor from '../Editor'
import Icon from "react-native-vector-icons/FontAwesome"
import Hyperlink from 'react-native-hyperlink'
import NodeTools from './NodeTools'
import linking from '../linking'

export default class FoundNodeComponent extends Component {

  constructor(props) {
    super()
    var {node} = props
    this.node = node
    this.subscribeTo(node)
  }

  render() {
    return <View style={this.wrapStyle}>
      {this.body()}
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
    return <View
      style={{width: '100%'}}
      onTouchStart={ e => this.touchStartX = e.nativeEvent.locationX}
    >
      <Text onPress={this.pressBody}>
        {this.header()}
        {this.renderDescription()}
      </Text>
    </View>
  }

  header() {
    var {node} = this
    return <Text
      style={{color: '#4495ae'}}
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
        {this.node.description}
      </Text>
  }

  pressBody(e) {
    var parent = this.node
    while ((parent = parent.parent)) {
      parent.update({expanded: true})
    }
  }

}