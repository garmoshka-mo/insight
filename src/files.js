/** @providesModule filesService
 **/

import ComponentController from './ComponentController'
import {logr, showFlash} from "./commonFunctions"
import {showError} from './errors'
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
import viewport from "./viewport";

export default new class Files extends ComponentController {

  list = []

  async init() {
    AppState.addEventListener('change', (appState) => {
      if (appState == 'background') this.uploadChanges()
    })
    // await this.resetFiles()
    this.reloadList()
  }

  async showList() {
    actionsSheetController.open(<FilesList />)
  }

  async reloadList() {
    var keys = await AsyncStorage.getAllKeys()
    keys = keys.filter(_ => _.startsWith("meta_id"))
    var items = await AsyncStorage.multiGet(keys)
    this.list.replace(
      items.map((row) => new File(JSON.parse(row[1])))
    )
  }

  async resetFiles() {
    var keys = await AsyncStorage.getAllKeys()
    keys = keys.filter(_ => _.startsWith("meta_id"))
    await Promise.all(
      keys.map(key => AsyncStorage.removeItem(key))
    )
  }

  async downloadUpdates() {
    let response = await s.dropbox.filesListFolder({path: ''}) // todo: handle response.result.has_more
    this.stats = {downloaded: 0, conflicts: 0 }
    var promises = response?.result?.entries.map(this.processFile)
    await Promise.all(promises)
    await this.reloadList()
    this.report()
    return true
  }

  report() {
    var type = "default", message = ""
    if (this.stats.downloaded) {
      type = "success"
      message += ` Downloaded ${this.stats.downloaded}`
    }
    if (this.stats.conflicts) {
      type = "warning"
      message += ` Conflicts ${this.stats.conflicts}`
    }
    if (!message) message = "Up to date"
    logr(`♻️  ${message}`)
    showFlash(message, type)
  }

  async processFile(meta) {
    try {
      if (!meta.name.endsWith('.yml') || meta.size > 2000000) return

      var localMeta = await File.load(meta.id)

      if (localMeta) {
        if (this.wasChangedOnServer(localMeta, meta)) {
          if (!localMeta.unchanged) {
            await conflictResolver.resolve(meta)
            await this.upload(localMeta)
            this.stats.conflicts++
            return 'locally changed file uploaded to server'
          }
        } else {
          return 'latest version already downloaded'
        }
      }
      await this.download(meta)
    } catch (err) {
      showError(err, 'processFile error')
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
      if (meta.id == viewport.file?.id)
        viewport.file.openFile()
      this.stats.downloaded++
      logr(`⏬ downloaded ${meta.name}`)
    } catch(err) {
      showError(err, 'Download error', {response, tempFilePath: path})
    }
  }

  async upload(meta) {
    this.updateMeta(meta, {unchanged: true})
  }

  // todo: move to File
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
      showError(err)
    }
  }


}
