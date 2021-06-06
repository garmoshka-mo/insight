/** @providesModule RichItem
 **/

import React from "../utils/react-tuned"
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,

} from 'react-native'
import PlainItem from './PlainItem'

export default class RichItem extends PlainItem {

  titleColor = '#2280a5'

  // toggle() {
  //   this.setState({showSubItems: !this.state.showSubItems})
  // }

  get wrapStyle() {
    return Object.assign({}, super.wrapStyle, {

    })
  }

  renderSubItems() {
    var {node} = this
    if (!this.state.expanded) return
    return node.children.map(
      child => child.render()
    )
  }

}