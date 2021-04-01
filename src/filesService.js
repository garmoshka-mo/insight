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
      var response = await auth.dropbox.filesDownload({path: file.path_lower})
      var path = response && response.path()
      if (!(response.data && path))
        throw('Download response has no data or path')

      await fs.moveFile(file.name, path)
      showSuccessFlash('Download successful')
    } catch(err) {
      errorDialog(err, {response, tempFilePath: path})
    }
  }


}

export default new FilesService()