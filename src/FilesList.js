import React, {Component} from "../utils/react-tuned"
import {View, Text, TouchableOpacity} from 'react-native'
import sample from './sampleData'
import _ from 'lodash'
import YamlNode from "./YamlNode"
import Dropbox from "./Dropbox";
import {logr} from "./commonFunctions";
import ActionsSheetDialog from './ActionsSheetDialog'
import styles from "./styles";

export default class extends Component {

  render() {
    return <View>
      {this.props.files.map(this.file)}
    </View>
  }

  file(file) {
    return <TouchableOpacity
      key={file.id}
      style={{paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: styles.textColor
      }}
      onPress={file.open}
    >
      <Text style={styles.text}>{file.name}</Text>
    </TouchableOpacity>
  }

}