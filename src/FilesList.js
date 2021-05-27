import React, {Component} from "../utils/react-tuned"
import {View, Text, TouchableOpacity} from 'react-native'
import sample from './sampleData'
import _ from 'lodash'
import YamlNode from "./YamlNode"
import Dropbox from "./Dropbox";
import {logr} from "./commonFunctions";
import ActionsSheetDialog from './ActionsSheetDialog'
import styles from "./styles";
import actionsSheetController from "./actionsSheetController";
import files from "./files";

export default class extends Component {

  constructor() {
    super()
    this.subscribeTo(files)
  }

  render() {
    return <View>
      {files.list.map(this.file)}
    </View>
  }

  file(file) {
    return <TouchableOpacity
      key={file.id}
      style={{paddingHorizontal: 10,
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: styles.textColor
      }}
      onPress={_ => this.open(file)}
    >
      <Text style={styles.text}>{file.name}</Text>
    </TouchableOpacity>
  }

  open(file) {
    actionsSheetController.hide()
    file.openFile()
  }

}