import React, {Component} from "../utils/react-tuned"
import {View, Text, TouchableOpacity} from 'react-native'
import styles, {colors} from "./styles";
import actionsSheetController from "./actionsSheetController";
import files from "./files";
import DialogInput from 'react-native-dialog-input'

export default class extends Component {

  controllers = [files]
  state = {createDialog: false}

  render() {
    return <View>
      {files.list.map(this.fileRow)}
      {this.createButton}
      {this.createDialog}
    </View>
  }

  fileRow(file) {
    return <TouchableOpacity
      key={file.id}
      style={{paddingHorizontal: 10,
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.shadow
      }}
      onPress={_ => this.open(file)}
    >
      <Text style={styles.text}>{file.name}</Text>
    </TouchableOpacity>
  }

  get createButton() {
    return <TouchableOpacity
      style={{paddingHorizontal: 10,
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.shadow
      }}
      onPress={_ => this.setState({createDialog: true})}
    >
      <Text style={[styles.text, {textAlign: 'center'}]}>Create new</Text>
    </TouchableOpacity>
  }

  open(file) {
    actionsSheetController.close()
    file.openFile()
  }

  createNew(name) {
    if (name) {
      `${name}.yml`
    }
    this.setState({createDialog: false})
  }
  
  get createDialog() {
    return <DialogInput
      isDialogVisible={this.state.createDialog}
      dialogStyle={{backgroundColor: colors.light}}
      title={"Create new file"}
      submitInput={ (name) => {this.createNew(name)} }
      closeDialog={ _=> this.setState({createDialog: false})}>
    </DialogInput>
  }

}