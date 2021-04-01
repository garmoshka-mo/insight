/** @providesModule commonFunctions
 **/

import { Alert } from 'react-native'

export function errorDialog(err, data, title) {
  console.error('Error', err)
  console.error('JSON.stringify Error', JSON.stringify(err))
  // alert ..
}

export function showSuccessFlash(message) {
  // install flash
  Alert.alert(message)
}

export function logr() {
  if (__DEV__) {
    var args = []
    for (let arg of arguments) {
      //if (typeof arg == 'object')
      //  args.push(JSON.stringify(sanitizeData(arg), null, 2))
      //else
        args.push(arg)
    }
    console.log(...args)
  }
}