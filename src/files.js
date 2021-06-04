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

  async sync() {
    // todo: наверно все конфликты будут разруливаться при аплоаде
    // и при даунлоаде, если случается - кидать эксепшн просто на всякий случай
    this.stats = {downloaded: 0, conflicts: 0, uploaded: 0 }
    await this.uploadChanges()
    await this.downloadUpdates()
    this.report()
    await this.reloadList()
    return true
  }

  async downloadUpdates() {
    let response = await s.dropbox.filesListFolder({path: ''}) // todo: handle response.result.has_more
    var promises = response?.result?.entries.map(this.processFile)
    await Promise.all(promises)
  }

  report() {
    var type = "default", message = ""
    if (this.stats.downloaded) {
      type = "success"
      message += ` Downloaded ${this.stats.downloaded}`
    }
    if (this.stats.uploaded) {
      type = "success"
      message += ` Uploaded ${this.stats.uploaded}`
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

      var localFile = await File.load(meta.id)

      if (localFile) {
        if (this.wasChangedOnServer(localFile, meta) && localFile.changed) {
          throw('Local file changed during sync. Re-sync needed.')
        } else {
          return 'latest version already downloaded'
        }
      }
      await this.download(meta)
    } catch (err) {
      showError(err, 'processFile error')
    }
  }

  wasChangedOnServer(localFile, meta) {
    // also can use .server_modified
    return localFile.content_hash != meta.content_hash
  }

  async download(meta) {
    try {
      var response = await s.dropbox.filesDownload({path: meta.path_lower})
      var path = response && response.path()
      if (!path) throw('Download response has no data or path')

      await fs.moveFile(path, meta.id)
      this.updateMeta(meta, {changed: false})
      if (meta.id == viewport.file?.id)
        viewport.file.openFile()
      this.stats.downloaded++
      logr(`⏬ downloaded ${meta.name}`)
    } catch(err) {
      showError(err, 'Download error', {response, tempFilePath: path})
    }
  }

  async upload(meta) {
    this.updateMeta(meta, {changed: false})
  }

  // todo: move to File
  updateMeta(meta, data) {
    Object.assign(meta, data)
    AsyncStorage.set(`meta_${meta.id}`, meta)
  }

  async uploadChanges() {
    this.list.each(file => {
      if (file.changed) {
        if (file.upload() == 'conflict') this.stats.conflicts++
        this.stats.uploaded++
      }
    })
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
