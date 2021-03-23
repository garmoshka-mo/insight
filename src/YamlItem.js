/** @providesModule YamlItem
 **/

import React, {Component} from "../utils/react-tuned"
import {
  Text,
  TextInput,
  View,
} from 'react-native'

export default class YamlItem extends Component {

  render() {
    return <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
      <TextInput
        value={this.props.name}
      ></TextInput>
      {this.content()}
    </View>
  }

  content() {
    if (typeof this.props.content == 'string')
      return this.text()
    else
      return this.subitems()
  }

  text() {
    return <Text>
      {this.props.content}
    </Text>
  }

  subitems() {
    var result = [], {content} = this.props
    for (const key in content)
      result.push(<YamlItem name={key} content={content[key]} />)
    return result
  }

}