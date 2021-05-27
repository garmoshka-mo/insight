/** @providesModule Dropbox
 **/

import React, {Component} from "../utils/react-tuned"
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  FlatList,
  StyleSheet
} from 'react-native'
import auth from './auth'
import filesService from "./files"
import {logr} from './commonFunctions'
import menuController from "./menuController";


export default class extends Component {

  controllers = [auth, filesService]

  componentDidMount() {
    auth.getAuthUrl()
    //auth.devLogin()
  }

  render() {
    var content
    if (auth.loading) content = <Text>Loading...</Text>
    else if (auth.isAuthenticated) content = this.dropbox()
    else content = this.authUrl()
    return <View>{content}</View>
  }

  authUrl() {
    if (!auth.authUrl) return

    return (
      <TouchableOpacity
        style={{margin: 20}}
        activeOpacity={1}
        onPress={() => Linking.openURL(auth.authUrl)}
      >
        <Text style={{fontSize: 20}}>Authenticate</Text>
      </TouchableOpacity>
    )
  }

  dropbox() {
    return []
  }

  documentPicker() {
    return (
      <TouchableOpacity
        key={'documentPicker'}
        onPress={filesService.pickFileForUpload}
      >
        <Text style={styles.header}>Pick file for upload</Text>
      </TouchableOpacity>
    )
  }

  files() {
    if (!filesService.files.length) return
    // logr('files', filesService.files)

    return (
      <View key={'files'}>
        <Text style={styles.header}>List of files</Text>
        <FlatList
          data={filesService.files}
          keyExtractor={item => item.id}
          renderItem={item => this.renderFile(item.item)}
        />
      </View>
    )
  }

  renderFile(file) {
    return (
      <TouchableOpacity onPress={() => filesService.download(file)}>
        <Text>{file.name}</Text>
      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginBottom: 5
  }
})