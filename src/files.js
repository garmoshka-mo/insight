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

  async loadList() {
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

      var localFile = this.fileById(meta.id)

      if (localFile) {
        if (this.wasChangedOnServer(localFile, meta)) {
          if (localFile.changed)
            throw('Local file changed during sync. Re-sync needed.')
          else
            'will download'
        } else {
          return 'latest version already downloaded'
        }
      } else {
        localFile = new File(meta)
        this.list.push(localFile)
      }

      await localFile.download()

      meta.changed = false
      localFile.updateMeta(meta)
      this.stats.downloaded++

      if (localFile.id == viewport.file?.id)
        localFile.openFile()

    } catch (err) {
      showError(err, 'processFile error')
    }
  }

  fileById(id) {
    return this.list.find(f => f.id == id)
  }

  wasChangedOnServer(localFile, meta) {
    // also can use .server_modified
    return localFile.content_hash != meta.content_hash
  }

  async uploadChanges() {
    for (const file of this.list) {
      if (file.changed) {
        if (await file.upload() == 'conflict')
          this.stats.conflicts++
        this.stats.uploaded++
      }
    }
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
