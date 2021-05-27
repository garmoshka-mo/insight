/** @providesModule filesService
 **/

import ComponentController from './ComponentController'
import {errorDialog, logr, showFlash} from "./commonFunctions"
import fs from './fs'
import DocumentPicker from 'react-native-document-picker'
import {AppState} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import conflictResolver from './conflictResolver'
import s from './services'
import actionsSheetController from './actionsSheetController'
import React from "../utils/react-tuned"
import FilesList from './FilesList'
import File from "./File";

export default new class Files extends ComponentController {

  files = []

  init() {
    AppState.addEventListener('change', (appState) => {
      if (appState == 'background') this.uploadChanges()
    })
  }

  async showList() {
    actionsSheetController.open(<FilesList files={await this.list()} />)
  }

  async list() {
    var keys = await AsyncStorage.getAllKeys()
    var items = await AsyncStorage.multiGet(keys)
    return items.map((row) => new File(JSON.parse(row[1])))
  }

  async downloadUpdates() {
    let response = await s.dropbox.filesListFolder({path: ''}) // todo: handle response.result.has_more
    response?.result?.entries.each(this.processFile)
  }

  async processFile(meta) {
    try {
      if (!meta.name.endsWith('.yml') || meta.size > 2000000) return

      var localMeta = await AsyncStorage.get(`meta_${meta.id}`)
      if (localMeta) {
        if (this.wasChangedOnServer(localMeta, meta)) {
          if (!localMeta.unchanged) {
            await conflictResolver.resolve(meta)
            await this.upload(localMeta)
            return 'locally changed file uploaded to server'
          }
        } else {
          return 'latest version already downloaded'
        }
      }
      await this.download(meta)
    } catch (err) {
      errorDialog(err, 'processFile error')
    }
  }

  wasChangedOnServer(localMeta, meta) {
    // also can use .server_modified
    return localMeta.content_hash != meta.content_hash
  }

  async download(meta) {
    try {
      var response = await s.dropbox.filesDownload({path: meta.path_lower})
      var path = response && response.path()
      if (!path) throw('Download response has no data or path')

      await fs.moveFile(path, meta.id)
      this.updateMeta(meta, {unchanged: true})
    } catch(err) {
      errorDialog(err, 'Download error', {response, tempFilePath: path})
    }
  }

  async upload(meta) {
    this.updateMeta(meta, {unchanged: true})
  }

  updateMeta(meta, data) {
    Object.assign(meta, data)
    AsyncStorage.set(`meta_${meta.id}`, meta)
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

      await s.dropbox.filesUpload({path: res.uri})
      showFlash('Upload successful')
    } catch (err) {
      if (DocumentPicker.isCancel(err)) return
      errorDialog(err)
    }
  }


}


AsyncStorage.set = (key, data) =>
  AsyncStorage.setItem(key, JSON.stringify(data))

AsyncStorage.get = async (key) => {
  var data = await AsyncStorage.getItem(key)
  return JSON.parse(data)
}