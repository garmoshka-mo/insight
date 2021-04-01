/** @providesModule fs
 **/

import RNFS from 'react-native-fs'


class Fs {
  constructor() {
    this._initRootDir()
  }

  rootDir() {
    return (RNFS.ExternalStorageDirectoryPath || RNFS.DocumentDirectoryPath) + "/insight"
  }

  async moveFile(name, tempPath) {
    let newPath = `${this.rootDir()}/${name}`
    await RNFS.moveFile(tempPath, newPath)
  }

  // private

  _initRootDir() {
    RNFS.mkdir(this.rootDir())
  }

}

export default new Fs()