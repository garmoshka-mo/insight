/** @providesModule fs
 **/

import RNFS from 'react-native-fs'


class Fs {

  rootDir() {
    return (RNFS.ExternalStorageDirectoryPath || RNFS.DocumentDirectoryPath)
  }

  async writeToFile(fileName, content) {
    let path = `${this.rootDir()}/${fileName}`
    await RNFS.writeFile(path, JSON.stringify(content), 'utf8')
  }

}

export default new Fs()