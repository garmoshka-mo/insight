/** @providesModule filesService
 **/

import ComponentController from './ComponentController'
import auth from './auth'
import {errorDialog} from "./commonFunctions";
import fs from './fs'


class FilesService extends ComponentController {

  files = []

  async download(file) {
    try {
      let response = await auth.dropbox.filesDownload({path: file.path_lower})
      let {name, fileBlob} = response.result
      await fs.writeToFile(name, fileBlob)
    } catch(err) {
      errorDialog(err)
    }
  }


}

export default new FilesService()