import fs from "./fs";
import yaml from 'js-yaml'
import autoBind from "../utils/autoBind";
import s from './services'
import {showError} from './errors'
import settings from './settings'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class File {

  constructor(meta) {
    Object.assign(this, meta)
    autoBind(this)
  }

  static async load(id) {
    var meta = await AsyncStorage.get(`meta_${id}`)
    return new this(meta)
  }

  async openFile() {
    s.viewport.load(await this.data())
    settings.update({recentFileId: this.id})
  }

  async data() {
    try {
      var content = await fs.readFile(this.id)
      return yaml.load(content)
    } catch (err) {
      showError(err, "Can't load file")
    }
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