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
    let newPath = this.filePath(id)
    await RNFS.moveFile(tempPath, newPath)
  }

  async readFile(id) {
    return await RNFS.readFile(this.filePath(id), 'utf8')
  }

  // private

  filePath(id) {
    return `${this.rootDir()}/${id.replace(':', '_')}.yml`
  }

  async _initRootDir() {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    RNFS.mkdir(this.rootDir())
  }

}

export default new Fs()