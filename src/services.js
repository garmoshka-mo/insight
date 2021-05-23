// s

import {Dropbox} from "dropbox"

export default new class {

  dropbox = null

  initDropbox(token) {
    this.dropbox = new Dropbox({ accessToken: token })
  }

}