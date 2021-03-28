/** @providesModule Main
 **/

import React, {Component} from "../utils/react-tuned"
import { View, Linking } from 'react-native'
import YamlView from "./YamlView";
import DropboxAuth from './DropboxAuth'
//const parseUrl = require('url-parse')


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

  handleLinkingUrl(_url) {
    console.log('handle deep links url', _url)

    /*
    handle deep links url insight://auth#uid=3986894416&access_token=sl.At7ng2Tlb3y0UhhJAXt3BhfjMxkq1cP6uIWvZHj6ee_nx2CamJYHeibvYz-Ga0RC5SJz5qyuGgF28Mgt1MZIH4Noo9I17z9dvBf53pEdnvyUUfMm0qqHc04lqYjsrN5_vkHtL44&expires_in=14400&token_type=bearer&scope=account_info.read&account_id=dbid%3AAACIbLRB4h2sP_iOpzYEClE4VCs_6uos2iU
     */

    /*let url = parseUrl(_url, true)
    if (url.host == 'update-password') {
      let routeData = { query: url.query }
      rootNav.navigate('updatePassword', routeData)
    }*/
  }

  render() {
    return (
      <View>
        <DropboxAuth />
        <YamlView />
      </View>
    )
  }
}