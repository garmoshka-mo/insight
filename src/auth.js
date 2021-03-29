/** @providesModule auth
 **/

import ComponentController from './ComponentController'
import {Dropbox} from "dropbox"
import config from "../config/config"
import _ from 'lodash'


class Auth extends ComponentController {
  constructor() {
    super()
    if (__DEV__) {
      this.token = "sl.At64Ajpep8ku_HQVpAbJ_FsdNVnwpxegVNS_kIcqzNqOt_o_C3A_cu5YPkdhKynOnY7_GiBDQmn23apVorirNTD6nxJjBkhTAEOg7x0ngHVnDEYuh7cYhirxUWdK2BZJlbniMC_hXlA"
      this.authenticate(this.token)
    }
  }

  async authenticate(token) {
    try {
      let dropbox = new Dropbox({ accessToken: token })
      let response = await dropbox.filesListFolder({path: ''})
      this.update({
        token,
        files: _.get(response, 'result.entries', []) // todo: move files from auth, handle response.result.has_more
      })
    } catch(err) {
      console.error('err', JSON.stringify(err))
      /*
        todo errorDialog
        JSON.stringify(err) sample
        {"name":"DropboxResponseError","status":400,"headers":{"map":{"x-dropbox-request-id":"63c8eb6be2fd46efaae5b27271c104ce","x-dropbox-response-origin":"far_remote","content-security-policy":"sandbox allow-forms allow-scripts","vary":"Accept-Encoding","content-type":"text/plain; charset=utf-8","date":"Sun, 28 Mar 2021 15:23:27 GMT","server":"envoy"}},"error":"Error in call to API function \"files/list_folder\": Your app is not permitted to access this endpoint because it does not have the required scope 'files.metadata.read'. The owner of the app can enable the scope for the app using the Permissions tab on the App Console.","line":108608,"column":19,"sourceURL":"http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.insight&modulesOnly=false&runModule=true"}
       */
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