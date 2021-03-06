/** @providesModule auth
 **/

import ComponentController from '../utils/ComponentController'
import {Dropbox} from "dropbox"
import config from "../config/config"
import files from './files'
import {logr, showFlash} from "./commonFunctions";
import {showError} from './errors'
import {Linking, Platform} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import s from './services'
import 'react-native-url-polyfill/auto'

class Auth extends ComponentController {

  loading = true

  constructor() {
    super()
    this.handleDeepLinks()
  }

  async load() {
    var token = config.token || await AsyncStorage.getItem('token')
    if (token) await this.loadDropboxData(token)
    else await this.login()
  }

  async loadDropboxData(token) {
    try {
      this.update({ token, loading: false })
      await s.initDropbox(token)
      await files.sync()
      this.update({ loading: false })
    } catch(err) {
      if (err.error?.error?.['.tag'] == "expired_access_token") {
        this.logout()
      } else
        showError(err)
    }
  }

  logout() {
    logr("🔑 Logging out")
    var token = null
    this.update({ token, loading: false })
    AsyncStorage.removeItem('token')
    showFlash('Logged out')
  }

  devLogin() {
    if (!__DEV__) return
    this.loadDropboxData("8YA1_oZq1WwAAAAAAAAAAemF4zn6JiG_omAHyUxKaVWR5RIAtzvDDfbZ6E4Cwfge")
  }

  get isAuthenticated() {
    return !!this.token
  }

  async login() {
    let dropbox = new Dropbox({ clientId: config.clientId });
    let authUrl = await dropbox.auth.getAuthenticationUrl('insight://auth?')
    Linking.openURL(authUrl)
  }

  async handleDeepLinks() {
    if (this.isAuthenticated) return

    const initialUrl = await Linking.getInitialURL()
    if (initialUrl) this.handleLinkingUrl(initialUrl)
    Linking.addEventListener('url', ({ url }) => {
      this.handleLinkingUrl(url)
    })
  }

  handleLinkingUrl(url) {
    // url = new URL('insight://auth.com?uid=7682069&access_token=sl.AxocvOranothRw19rx8NVOosHq1VxNcoKGfqp3WUEIWUAFvVOGyS8e9hCoAoSjVT6K0QHKoMQK8OfqeYsEZk6vJmGUH8fXIjx2fdRfoG3Yvis4zXsjZzujnkl1Abo0V3M1sOi7A&expires_in=14399&token_type=bearer&scope=account_info.read+files.content.read+files.content.write+files.metadata.read+files.metadata.write&account_id=dbid%3AAADlY3B373KR5DZZ6sO2IH-UuW9doO4AK5Y')
    // insight://auth?#access_token=bXZI7ACdH4UAAAAAAAAAAb7AbmnFc_iwsc9dO-6wNyqzVxd1Hk4y_raraHz9u_31&token_type=bearer&uid=7682069&account_id=dbid%3AAADlY3B373KR5DZZ6sO2IH-UuW9doO4AK5Y&scope=account_info.read+files.content.read+files.content.write+files.metadata.read+files.metadata.write

    url = new URL(url.replace("//auth?#", "//auth?"))
    let token = url.searchParams.get('access_token')
    AsyncStorage.setItem('token', token)
    this.loadDropboxData(token)
  }

}

export default new Auth()