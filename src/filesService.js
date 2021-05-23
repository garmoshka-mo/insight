/** @providesModule filesService
 **/

import ComponentController from './ComponentController'
import auth from './auth'
import {errorDialog, logr, showSuccessFlash} from "./commonFunctions"
import fs from './fs'
import _ from "lodash"
import DocumentPicker from 'react-native-document-picker'
import {AppState} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import conflictResolver from './conflictResolver'

class FilesService extends ComponentController {

  files = []

  init() {
    AppState.addEventListener('change', (appState) => {
      if (appState == 'background') this.uploadChanges()
    })
  }

  async loadFiles() {
    let response = await auth.dropbox.filesListFolder({path: ''}) // todo: handle response.result.has_more
    response?.result?.entries.each(this.processFile)
  }

  async processFile(meta) {
    if (!meta.name.endsWith('.yml') || meta.size > 2000000) return

    var localMeta = AsyncStorage.get(`meta_${meta.id}`)
    if (localMeta) {
      // also can use .server_modified
      if (localMeta.content_hash != meta.content_hash) {
        // todo: upload local file as conflict
      }
    }
    AsyncStorage.set(`meta_${meta.id}`, meta)
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

  async uploadChanges() {
    logr('Todo: upload changes...')
  }

  async pickFileForUpload() {
    // Pick a single file
    try {
      let res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      })

      await auth.dropbox.filesUpload({path: res.uri})
      showSuccessFlash('Upload successful')
    } catch (err) {
      if (DocumentPicker.isCancel(err)) return
      errorDialog(err)
    }
  }


}

export default new FilesService()


AsyncStorage.set = (key, data) =>
  AsyncStorage.setItem(key, JSON.stringify(data))

AsyncStorage.get = async (key) => {
  var data = await AsyncStorage.getItem(key)
  return JSON.stringify(data)
}