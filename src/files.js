/** @providesModule filesService
 **/

import React from "../utils/react-tuned"
import ComponentController from '../utils/ComponentController'
import {logr, showFlash} from "./commonFunctions"
import {showError} from './errors'
import DocumentPicker from 'react-native-document-picker'
import {AppState} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import s from './services'
import File from "./File";
import dashboard from "./dashboard";
import _ from "lodash"
import settings from "./settings";
import pickFolder from "./pickFolder";

export default new class Files extends ComponentController {

  list = []

  async init() {
    AppState.addEventListener('change', (appState) => {
      if (appState == 'background') this.uploadChanges()
      if (appState == 'active' && s.dropbox) this.sync({skipUpToDate: true})
    })
  }

  async loadList() {
    var keys = await AsyncStorage.getAllKeys()
    keys = keys.filter(_ => _.startsWith("meta_id"))
    var items = await AsyncStorage.multiGet(keys)
    this.list = items.map((row) => new File(JSON.parse(row[1])))
    this.sort()
  }

  async create(name) {
    var file = await File.create(name)
    if (file) this.list.push(file)
    this.refresh()
  }

  sort() {
    this.list = _.sortBy(this.list, 'name')
  }

  async resetFiles() {
    await this.uploadChanges()

    var keys = await AsyncStorage.getAllKeys()
    keys = keys.filter(_ => _.startsWith("meta_id"))
    await Promise.all(
      keys.map(key => AsyncStorage.removeItem(key))
    )
    this.list.length = 0
    settings.update({recentFileId: ''})
    showFlash(`Files deleted: ${keys.length}`)
  }

  async sync(options = {}) {
    this.stats = {downloaded: 0, conflicts: 0, uploaded: 0 }
    if (!settings.path) {
      var path = await pickFolder('')
      settings.update({path})
    }
    if (!this.list.length) await this.loadList()
    await this.uploadChanges()
    await this.downloadUpdates()
    this.sort()
    this.report(options)
    this.refresh()
    return true
  }

  async downloadUpdates() {
    var {path} = settings
    let response = await s.dropbox.filesListFolder({path}) // todo: handle response.result.has_more
    var promises = response?.result?.entries.map(this.processFile)
    await Promise.all(promises)
  }

  report(options) {
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
    if (!message) {
      message = "Up to date"
      if (options.skipUpToDate) return logr(message)
    }
    logr(`♻️  ${message}`)
    showFlash(message, {type})
  }

  async processFile(remote) {
    try {
      if (!remote.name.endsWith('.yml') ||
        remote.name.includes('conflict') ||
        remote.size > 2000000
      ) return

      var localFile = this.fileById(remote.id)

      if (localFile) {
        await localFile.updateName(remote)
        if (this.wasChangedOnServer(localFile, remote)) {
          if (localFile.changed)
            throw('Local file changed during sync. Re-sync needed.')
          else
            logr(`File ${remote.name} changed on server`, localFile.content_hash, remote.content_hash)
        } else {
          return 'latest version already downloaded'
        }
      } else {
        localFile = new File(remote)
        this.list.push(localFile)
      }

      await localFile.download()

      remote.changed = false
      localFile.updateMeta(remote)
      this.stats.downloaded++

      if (localFile.id == dashboard.file?.id)
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
