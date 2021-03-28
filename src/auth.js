/** @providesModule auth
 **/

import ComponentController from './ComponentController'
import {Dropbox} from "dropbox"
import config from "../config/config"


class Auth extends ComponentController {

  async authenticate(token) {
    try {
      let dropbox = new Dropbox({ accessToken: token })
      let response = await dropbox.filesListFolder({path: ''})
      console.log('response', response) // files: response.result.entries
      this.update({ token })
    } catch(err) {
      console.error('err', err) // todo errorDialog
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