/** @providesModule fs
 **/

import RNFS from 'react-native-fs'
import {PermissionsAndroid} from 'react-native'

class Fs {
  constructor() {
    this._initRootDir()
  }

  rootDir() {
    var path
    if (RNFS.ExternalStorageDirectoryPath)
      path = `${RNFS.ExternalStorageDirectoryPath}/Documents`
    else
      path = RNFS.DocumentDirectoryPath
    return `${path}/insight`
  }

  async moveFile(name, tempPath) {
    let newPath = `${this.rootDir()}/${name}`
    await RNFS.moveFile(tempPath, newPath)
  }

  // private

  async _initRootDir() {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    RNFS.mkdir(this.rootDir())
  }

}

export default new Fs()