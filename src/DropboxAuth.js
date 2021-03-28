/** @providesModule DropboxAuth
 **/

import React, {Component} from "../utils/react-tuned"
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import auth from './auth'


export default class extends Component {
  constructor(props) {
    super(props)
    this.subscribeTo(auth)
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
    return (
      <Text>{auth.token}</Text>
    )
  }

}