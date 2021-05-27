/** @providesModule auth
 **/

import ComponentController from './ComponentController'
import {Dropbox} from "dropbox"
import config from "../config/config"
import filesService from './files'
import {logr, showFlash} from "./commonFunctions";
import {showError} from './errors'
import {Linking} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import s from './services'

class Auth extends ComponentController {

  loading = true

  constructor() {
    super()
    this.handleDeepLinks()
  }

  async load() {
    var token = await AsyncStorage.getItem('token')
    if (token) await this.loadDropboxData(token)
    else await this.login()
  }

  async loadDropboxData(token) {
    try {
      await s.initDropbox(token)
      this.update({ token, loading: false })
      await filesService.downloadUpdates()
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
    let authUrl = await dropbox.auth.getAuthenticationUrl('insight://auth')
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
    let anchor1 = url.indexOf('access_token=') + 'access_token='.length
    let anchor2 = url.indexOf('&expires_in')
    let token = url.slice(anchor1, anchor2)
    AsyncStorage.setItem('token', token)
    this.loadDropboxData(token)
  }

}

export default new Auth()