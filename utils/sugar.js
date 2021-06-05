/** @providesModule sugar
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

Array.prototype.each = function(callback) {
  this.forEach((_, i) => callback(_, i))
}

Array.prototype.merge = function(chunk) {
  this.push.apply(this, chunk)
}

Array.prototype.flatten = function() {
  return [].concat.apply([], this)
}

Array.prototype.compact = function() {
  return this.filter(item => item)
}

Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index
  })
}

Array.prototype.addUnique = function(element) {
  if (!this.includes(element)) this.push(element)
}

Array.prototype.first = function() {
  if (this.length > 0) return this[0]
}

Array.prototype.last = function() {
  if (this.length > 0) return this[this.length - 1]
}

Array.prototype.max = function() {
  var result = Math.max.apply(null, this)
  return result == -Infinity ? null : result
}

Array.prototype.maxBy = function(callback) {
  var resultItem, maxValue = null
  this.each(item => {
    var itemValue = callback(item)
    if (!maxValue || itemValue > maxValue) {
      maxValue = itemValue
      resultItem = item
    }
  })
  return resultItem
}

Array.prototype.min = function() {
  var result = Math.min.apply(null, this)
  return result == Infinity ? null : result
}

Array.prototype.delete =
Array.prototype.remove = function() {
  var victim,
    victims = arguments,
    victimsCount = victims.length,
    victimPosition
  while (victimsCount && this.length) {
    victim = victims[--victimsCount]
    while ((victimPosition = this.indexOf(victim)) !== -1) {
      this.splice(victimPosition, 1)
    }
  }
  return this
}

Array.prototype.extractOne = function(callback) {
  var result = null
  this.some(item => result = callback(item))
  return result
}

Array.prototype.extract = function(callback) {
  var result = [], value
  this.each(item => {
    value = callback(item)
    if (value) result.push(value)
  })
  return result
}

Array.prototype.asyncExtract = async function(callback) {
  var result = []
  this.each(async item => {
    result.push(callback(item))
  })
  result = await Promise.all(result)
  return result.compact()
}


Array.prototype.findById = function (needleId) {
  return this.find(function (n) {
    return n.id == needleId
  })
}

Array.prototype.findByUuid = function (uuid) {
  if (!uuid) throw(`Empty uuid`)
  return this.find(function (n) {
    return n.uuid == uuid
  })
}

Array.prototype.replace = function (newValues) {
  this.splice(0, this.length, ...newValues)
}

Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0])
}

Array.prototype.insert = function (index, item) {
  this.splice( index, 0, item )
}

String.prototype.replaceAllByRegexStr = function(search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement)
}

String.prototype.removeSymbol = function(symbol) {
  return this.replaceAllByRegexStr(`\\${symbol}`, "")
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

export function defer() {
  var methods = {}
  var promise = new Promise(function(resolve, reject) {
    methods = {resolve, reject}
  })
  Object.assign(promise, methods)
  return promise
}

AsyncStorage.set = (key, data) =>
  AsyncStorage.setItem(key, JSON.stringify(data))

AsyncStorage.get = async (key) => {
  var data = await AsyncStorage.getItem(key)
  return JSON.parse(data)
}
