

import { getDeviceName } from 'react-native-device-info';
import moment from 'moment'

export default new class ConflictResolver {

  async resolve() {
    var originalName = 'originalName'
    var time = moment().format('YYMMDD_HH-mm-ss')
    var conflictedName = `${originalName} (conflict ${await getDeviceName()} ${time}).yml`
  }

}