// conflictResolver

import s from './services'
import { getDeviceName } from 'react-native-device-info';
import moment from 'moment'
import {randInRange, sleep} from "./commonFunctions";

export default new class ConflictResolver {

  async resolve(meta) {
    var originalPath = meta.path_display
    var time = moment().format('YYMMDD_HH-mm-ss')
    var conflictedPath = `${originalPath} (conflict ${await getDeviceName()} ${time}).yml`

    console.log('⚠️ Conflict detected', originalPath, conflictedPath)
    await this.copyFile(meta.path_display, conflictedPath)
  }

  async copyFile(from_path, to_path) {
    try {
      await s.dropbox.filesCopy({
        from_path, to_path,
        autorename: true
      })
    } catch (err) {
      if (err.error?.error?.reason?.['.tag'] == "too_many_write_operations") {
        await sleep(randInRange(1000, 2000))
        await this.copyFile(from_path, to_path)
      } else
        throw(err)
    }
  }

}