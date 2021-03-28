/** @providesModule DropboxAuth
 **/

import React, {Component} from "../utils/react-tuned"
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import {Dropbox, DropboxAuth} from 'dropbox'
import config from '../config/config'
import auth from './auth'


export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.subscribeTo(auth)
  }

  componentDidMount() {
    this.init()
  }

  render() {
    return (
      <View>
        {this.authUrl()}
      </View>
    )
  }

  authUrl() {
    if (!this.state.authUrl || auth.isAuthenticated) return

    return (
      <TouchableOpacity
        style={{margin: 20}}
        activeOpacity={1}
        onPress={() => Linking.openURL(this.state.authUrl)}
      >
        <Text style={{fontSize: 20}}>Authenticate</Text>
      </TouchableOpacity>
    )
  }

  async init() {
    // todo move logic to service
    if (auth.isAuthenticated) {
      let dropbox = new Dropbox({ accessToken: auth.token })
      dropbox.filesListFolder({path: ''})
        .then(function(response) {
          console.log(response.result.entries)
        })
        .catch(function(error) {
          console.error(error);
        });
    } else {
      let dropbox = new Dropbox({ clientId: config.clientId });
      let authUrl = await dropbox.auth.getAuthenticationUrl('insight://auth')
      this.setState( { authUrl })
    }
  }

}