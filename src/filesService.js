/** @providesModule filesService
 **/

import ComponentController from './ComponentController'
import auth from './auth'
import {errorDialog, showSuccessFlash} from "./commonFunctions"
import fs from './fs'
import _ from "lodash"
import DocumentPicker from 'react-native-document-picker'


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

  async pickFileForUpload() {
    // Pick a single file
    try {
      let res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      })

      await auth.dropbox.filesUpload({path: res.uri})
    } catch (err) {
      if (DocumentPicker.isCancel(err)) return
      errorDialog(err)
    }
  }


}

export default new FilesService()