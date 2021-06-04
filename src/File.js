import fs from "./fs";
import yaml from 'js-yaml'
import autoBind from "../utils/autoBind";
import s from './services'
import {showError} from './errors'
import settings from './settings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import conflictResolver from "./conflictResolver";
import {logr} from "./commonFunctions";

export default class File {

  constructor(meta) {
    Object.assign(this, meta)
    autoBind(this)
  }

  static async load(id) {
    var meta = await AsyncStorage.get(`meta_${id}`)
    if (meta) return new this(meta)
  }

  async openFile() {
    var data = await this.parseData()
    if (!data) return
    s.viewport.loadToPort(this)
    settings.update({recentFileId: this.id})
  }

  updateMeta(data) {
    Object.assign(this, data)
    AsyncStorage.set(`meta_${this.id}`, this)
  }

  async parseData() {
    try {
      var content = await this.data()
      content = content.replace(/\t/g, '    ')
      return yaml.load(content)
    } catch (err) {
      showError(err, "Can't load file")
    }
  }

  data() {
    return fs.readFile(this.filePath)
  }

  get filePath() {
    return `${fs.rootDir()}/${this.id.replace(':', '_')}.yml`
  }

  async save(obj) {
    await fs.saveFile(this.filePath, yaml.dump(obj))
    this.updateMeta({changed: true})
  }

  async upload() {
    if (await this._upload() == 'conflict') {
        await conflictResolver.backupConflict(this.path_display)
        if (await this._upload('overwrite') == 'conflict')
          throw("Double conflict on file upload")
    }

    this.updateMeta({changed: false, rev: uploadResult.rev})
    return true
  }

  async _upload(mode = "update") {
    var uploadResult = await s.dropbox.filesUpload({
      localPath: this.filePath, // (patched) local path of file to upload
      path: this.path_lower, // Path in the user's Dropbox to save the file
      mode: {
        ".tag": mode,
        "update": this.rev
      },
      // strict_conflict: true, // For example, always return a conflict error when mode = WriteMode.update and the given "rev" doesn't match the existing file's "rev", even if the existing file has been deleted. This also forces a conflict even when the target path refers to a file with identical contents.
      mute: true
    })
    // logr('uploadResult result', uploadResult, this.rev)

    var {error} = uploadResult
    if (error) {
      if (error.reason?.conflict) {
        return 'conflict'
      } else {
        throw(error)
      }
    }

    return true
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