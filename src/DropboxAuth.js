/** @providesModule DropboxAuth
 **/

import React, {Component} from "../utils/react-tuned"
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  FlatList
} from 'react-native'
import auth from './auth'
import filesService from "./filesService";


export default class extends Component {
  constructor(props) {
    super(props)
    this.subscribeTo(auth, filesService)
  }

  componentDidMount() {
    auth.getAuthUrl()
  }

  render() {
    return (
      <View>
        {auth.isAuthenticated ?
          this.files() : this.authUrl()}
      </View>
    )
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

  files() {
    if (!filesService.files.length) return
    // console.log('files', JSON.stringify(auth.files))

    return (
      <View>
        <Text style={{fontSize: 20, marginBottom: 5}}>List of files</Text>
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