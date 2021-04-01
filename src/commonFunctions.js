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