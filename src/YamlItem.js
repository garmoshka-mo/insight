/** @providesModule YamlItem
 **/

import React, {Component} from "../utils/react-tuned"
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,

} from 'react-native'

export default class YamlItem extends Component {

  constructor(props) {
    super()
    this.level = props.level || 0
  }

  render() {
    var style = {
      flexDirection:'row',
      marginLeft: this.level && 20,
      flexWrap:'wrap'
    }

    return <View style={style}>
      {this.header()}
      {this.subitems()}
    </View>
  }

  header() {
    var details = typeof this.props.content == 'string' ? this.props.content : ""
    return <Text>
        <Text
          onPress={_ => Alert.alert(this.props.name) }
          style={{color: '#2280a5'}}
        >
          {this.props.name}
        </Text>
        <View style={{width: 5}}/>
        {details}
    </Text>
  }

  subitems() {
    var result = [], {content} = this.props
    if (typeof content == 'string') return
    for (const key in content)
      result.push(<YamlItem
        name={key}
        level={this.level + 1}
        content={content[key]}
      />)
    return result
  }

}