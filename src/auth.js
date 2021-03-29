/** @providesModule auth
 **/

import ComponentController from './ComponentController'
import {Dropbox} from "dropbox"
import config from "../config/config"
import _ from 'lodash'
import filesService from './filesService'
import {errorDialog} from "./commonFunctions";


class Auth extends ComponentController {
  constructor() {
    super()
    if (__DEV__) {
      this.token = "8YA1_oZq1WwAAAAAAAAAAemF4zn6JiG_omAHyUxKaVWR5RIAtzvDDfbZ6E4Cwfge"
      this.login(this.token)
    }
  }

  async login(token) {
    try {
      let dropbox = new Dropbox({ accessToken: token })
      this.update({ token, dropbox })
      await filesService.getFiles()
    } catch(err) {
      errorDialog(err)
    }
  }

  get isAuthenticated() {
    return !!this.token
  }

  async getAuthUrl() {
    if (this.isAuthenticated || this.authUrl) return

    let dropbox = new Dropbox({ clientId: config.clientId });
    let authUrl = await dropbox.auth.getAuthenticationUrl('insight://auth')
    this.update( { authUrl })
  }

}

export default new Auth()