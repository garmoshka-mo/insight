/** @providesModule fs
 **/

import RNFS from 'react-native-fs'
import {PermissionsAndroid} from 'react-native'

class Fs {
  constructor() {
    this._initRootDir()
  }

  rootDir() {
    var path = RNFS.DocumentDirectoryPath
    return `${path}/insight`
  }

  async moveFile(tempPath, id) {
    // todo: move to File.js
    let newPath = `${this.rootDir()}/${id.replace(':', '_')}.yml`
    await RNFS.moveFile(tempPath, newPath)
  }

  async readFile(path) {
    return await RNFS.readFile(path, 'utf8')
  }

  saveFile(path, data) {
    return RNFS.writeFile(path, data, 'utf8')
  }

  // private

  async _initRootDir() {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    RNFS.mkdir(this.rootDir())
  }

}

export default new Fs()