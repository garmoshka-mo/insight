import fs from "./fs";
import yaml from 'js-yaml'
import autoBind from "../utils/autoBind";
import s from './services'
import files from './files'
import {showError} from './errors'
import settings from './settings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import conflictResolver from "./conflictResolver";
import {logr} from "./commonFunctions";
import _ from "lodash"
import YmlParser from "../utils/YmlParser.js";

export default class File {

  constructor(meta) {
    Object.assign(this, meta)
    autoBind(this)
  }

  static byId(id) {
    var file = files.fileById(id)
    if (!file) throw `File ${id} is not in files.list`
    return file
  }

  async openFile() {
    s.dashboard.displayFile(this)
    settings.update({recentFileId: this.id})
  }

  updateMeta(data) {
    Object.assign(this, data)
    return AsyncStorage.set(`meta_${this.id}`, this)
  }

  async parseData() {
    try {
      return YmlParser.parse(await this.data())
    } catch (err) {
      showError(err, "Can't load file")
    }
  }

  data() {
    logr('Reading data of', this.name)
    return fs.readFile(this.filePath)
  }

  get filePath() {
    return `${fs.rootDir()}/${this.id.replace(':', '_')}.yml`
  }

  async save(obj) {
    var result = yaml.dump(obj)
    result = result.replace(/: null/g, ":")
    await fs.saveFile(this.filePath, result)
    this.updateMeta({changed: true})
  }

  updateName(remote) {
    if (this.name != remote.name ||
      this.path_display != remote.path_display ||
      this.path_lower != remote.path_lower
    ) {
      return this.updateMeta(_.pick(remote,
        ['name', 'path_display', 'path_lower'])
      )
    }
  }

  async download() {
    var response = await s.dropbox.filesDownload({path: this.path_lower})
    var path = response && response.path()
    if (!path) throw('Download response has no data or path')

    await fs.moveFile(path, this.filePath)
    logr(`⏬ downloaded ${this.name}`)
  }

  async upload() {
    var result = true
    var uploadResult = await this._upload()
    if (uploadResult == 'conflict') {
      result = 'conflict'
      await conflictResolver.backupConflict(this.path_display)
      uploadResult = await this._upload('overwrite')
      if (uploadResult == 'conflict') throw("Double conflict on file upload")
    }

    uploadResult.changed = false
    await this.updateMeta(uploadResult)
    return result
  }

  async _upload(modeTag = "update") {
    var mode = {".tag": modeTag}
    if (modeTag == 'update') mode.update = this.rev

    var uploadResult = await s.dropbox.filesUpload({
      localPath: this.filePath, // (patched) local path of file to upload
      path: this.path_lower, // Path in the user's Dropbox to save the file
      mode,
      // strict_conflict: true, // For example, always return a conflict error when mode = WriteMode.update and the given "rev" doesn't match the existing file's "rev", even if the existing file has been deleted. This also forces a conflict even when the target path refers to a file with identical contents.
      mute: true
    })

    // logr('Upload result', uploadResult, this.rev)

    var {error} = uploadResult
    if (error) {
      if (error.reason?.conflict) {
        return 'conflict'
      } else {
        throw(error)
      }
    }

    return uploadResult
  }

}

/*
{
   ".tag":"file",
   "client_modified":"2021-05-23T21:24:45Z",
   "content_hash":"c32fa6f9362d1f6be30032efbaa455e2a81315af821876483da25ff658db8fee",
   "id":"id:wizna3JPGbcAAAAAAADjqQ",
   "is_downloadable":true,
   "name":"тян-1_подход.yml",
   "path_display":"/тян-1_подход.yml",
   "path_lower":"/тян-1_подход.yml",
   "rev":"015c305ec8b7f9b0000000230574b20",
   "server_modified":"2021-05-23T21:24:54Z",
   "size":38697
}
*/