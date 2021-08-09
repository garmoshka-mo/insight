/** @providesModule FoundNodeComponent
 **/

import React, {Component} from "../../utils/react-tuned"
import {
  Text,
  View,
} from 'react-native'
import styles, {colors} from '../styles'
import Icon from "react-native-vector-icons/FontAwesome"
import Highlighter from 'react-native-highlight-words';
import {sleep, strMatch} from "../commonFunctions";
import menuController from "../menu/menuController";
import searchMenu from "../menu/searchMenu";

export default class FoundNodeComponent extends Component {

  constructor(props) {
    super()
    var {node} = props
    this.node = node
    this.expanded = strMatch(node.description, searchMenu.searchString)
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
      {this.highlightText(node.name)}
      {' '}
      {this.rightIcons}
      {' '}
    </Text>
  }

  highlightText(text) {
    return <Highlighter
      highlightStyle={{backgroundColor: 'yellow'}}
      searchWords={[searchMenu.searchString]}
      textToHighlight={text}
    />
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
    if (this.expanded)
      return <Text
        style={styles.text}>
        {this.highlightText(this.node.description)}
      </Text>
  }

  async pressBody(e) {
    var parent = this.node
    if (this.expanded) this.node.update({expanded: true})
    while ((parent = parent.parent)) {
      parent.update({expanded: true})
    }
    menuController.pop()
    await sleep(300)
    this.node.focus()
  }

}