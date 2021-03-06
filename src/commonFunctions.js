/** @providesModule commonFunctions
 **/

import { Alert } from 'react-native'
import { showMessage, hideMessage } from "react-native-flash-message"
import actionsSheetController from "./actionsSheetController";


var flashShownAt = Date.now()
export function showFlash(message, options = {}) {
  if (!message) return

  flashShownAt = Date.now()
  options = {
    message: message.trim(),
    type: "success",
    style: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: "auto",
    titleStyle: {
      fontSize: 18
    },
    autoHide: true,
    ...options,
  }
  showMessage(options)
}

export function logr() {
  if (__DEV__) console.log(...formatObjects(arguments))
}

export function formatObjects(inputArgs) {
  var args = []
  for (let arg of inputArgs) {
    if (typeof arg == 'object')
      args.push(JSON.stringify(sanitizeData(arg), null, 2))
    else
      args.push(arg)
  }
  return args
}

export function serialize(obj) {
  if (!obj || typeof obj != "object") return obj
  try {
    return JSON.stringify(sanitizeData(obj))
  } catch {
    return toString(obj)
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

export function strMatch(text, substr) {
  if (text)
    return text.toLowerCase().includes(substr.toLowerCase())
}
