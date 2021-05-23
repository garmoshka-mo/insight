/** @providesModule commonFunctions
 **/

import { Alert } from 'react-native'

export function errorDialog(err, title = 'Error', data) {
  logr(`⛔️ ${title}:`, err.message, err)
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
      if (typeof arg == 'object')
        args.push(JSON.stringify(sanitizeData(arg), null, 2))
      else
        args.push(arg)
    }
    console.log(...args)
  }
}

export function sanitizeData(src, passedObjects = []) {
  // filter from functions and private props (startsWith "_")
  // reason: save models in storage: JSON cant stringify functions
  if (!src || typeof src != "object") return src
  if (passedObjects.includes(src)) return "(cycled reference)"
  passedObjects.push(src)

  let target = src.constructor == Array ? [] : {}

  for (let prop in src) {
    if (prop.startsWith('_') || typeof src[prop] == 'function') continue
    if (src.hasOwnProperty(prop)) {
      if (isObject(src[prop])) {
        target[prop] = sanitizeData(src[prop], passedObjects)
      } else {
        target[prop] = src[prop]
      }
    }
  }

  return target
}

function isObject(obj) {
  var type = typeof obj
  return type === 'object' && !!obj
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function randInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}