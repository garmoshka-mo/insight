/** @providesModule filesService
 **/

import ComponentController from './ComponentController'
import auth from './auth'
import {errorDialog, showSuccessFlash} from "./commonFunctions";
import fs from './fs'
import _ from "lodash";


class FilesService extends ComponentController {

  files = []

  async getFiles() {
    let response = await auth.dropbox.filesListFolder({path: ''}) // todo: handle response.result.has_more
    this.update({files: _.get(response, 'result.entries')})
  }

  async download(file) {
    try {
      let response = await auth.dropbox.filesDownload({path: file.path_lower})
      let {name, fileBlob} = response.result
      await fs.writeToFile(name, fileBlob)
      showSuccessFlash('Download successful')
    } catch(err) {
      errorDialog(err)
    }
  }


}

export default new FilesService()