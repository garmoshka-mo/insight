/** @providesModule fs
 **/

import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import {PermissionsAndroid} from 'react-native'

class Fs {
  constructor() {
    this._initRootDir()
  }

  rootDir() {
    var path = RNFS.DocumentDirectoryPath
    return `${path}/insight`
  }

  async moveFile(tempPath, newPath) {
    await RNFS.moveFile(tempPath, newPath)
  }

  async readFile(path) {
    return await RNFS.readFile(path, 'utf8')
  }

  saveFile(path, data) {
    return RNFetchBlob.fs.writeFile(path, data, 'utf8')
  }

  async ensureFile(path) {
    if (!await this.exists(path))
      await RNFS.writeFile(path, '')
  }

  exists(path) {
    return RNFS.exists(path)
  }

  // private

  async _initRootDir() {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    RNFS.mkdir(this.rootDir())
  }

}

export default new Fs()