/** @providesModule Main
 **/

import React, {Component} from "../utils/react-tuned"
import { View, Linking } from 'react-native'
import YamlView from "./YamlView";
import DropboxAuth from './DropboxAuth'
import auth from './auth'


export default class extends Component {

  componentDidMount() {
    this.handleDeepLinks()
  }

  async handleDeepLinks() {
    const initialUrl = await Linking.getInitialURL()
    if (initialUrl) this.handleLinkingUrl(initialUrl)
    Linking.addEventListener('url', ({ url }) => {
      this.handleLinkingUrl(url)
    })
  }

  handleLinkingUrl(url) {
    let anchor1 = url.indexOf('access_token=') + 'access_token='.length
    let anchor2 = url.indexOf('&expires_in')
    let token = url.slice(anchor1, anchor2)
    auth.authenticate(token)
  }

  render() {
    return (
      <View style={{margin: 10}}>
        <DropboxAuth />
        <YamlView />
      </View>
    )
  }
}