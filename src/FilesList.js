import React, {Component} from "../utils/react-tuned"
import {View, Text, TouchableOpacity} from 'react-native'
import styles, {colors} from "./styles";
import actionsSheetController from "./actionsSheetController";
import files from "./files";

export default class extends Component {

  controllers = [files]

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
        borderBottomColor: colors.text
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