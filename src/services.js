// s

import {Dropbox} from "dropbox"

export default new class {

  dropbox = null
  dashboard = null
  searchMenu = null

  initDropbox(token) {
    this.dropbox = new Dropbox({ accessToken: token })
  }

}