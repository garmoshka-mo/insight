/** @providesModule FoundNodeComponent
 **/

import React, {Component} from "../../utils/react-tuned"
import {
  Text,
  View,
} from 'react-native'
import styles, {colors} from '../styles'
import Highlighter from 'react-native-highlight-words';
import {sleep, strMatch} from "../commonFunctions";
import menuController from "../menu/menuController";
import searchMenu from "../menu/searchMenu";
import NodeComponent from "./NodeComponent";

export default class FoundNodeComponent extends NodeComponent {

  constructor(props) {
    super()
    var {node} = props
    this.node = node
  }

  get expanded() {
    return strMatch(this.node.description, searchMenu.searchString)
  }

  render() {
    return <View style={this.wrapStyle}>
      {this.body()}
    </View>
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
    return <Text style={this.headerStyle}>
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