/** @providesModule errors
 **/

import React, {Component} from "../utils/react-tuned"
import { Alert } from 'react-native'
import { showMessage, hideMessage } from "react-native-flash-message"
import actionsSheetController from "./actionsSheetController";
import {formatObjects, logr, serialize} from './commonFunctions'
import {Text, ScrollView, View} from 'react-native'
import {colors} from "./styles";


export function showError(error, title = 'Error', data) {
  const buttons = [{ text: 'OK' }]

  var message
  let details = serialize(error.details)
  if (error.internetError) {
    message = t('messages.internet_required')
    details = serialize(error)
  } else {
    if (typeof error == 'string') error = new Error(error)
    message = (error.message || error).toString()
  }

  if (details) {
    buttons.unshift({
      text: 'Details',
      onPress: () => {
        Alert.alert(title || 'Error details', details)
      }
    })
  }

  delete error.mark // clean trash
  logr(`⛔️ ${title || ""}:`, message,
    ...formatObjects([error, data]))

  setTimeout(_=> errorSheet(message), 210)

  // Alert.alert(title, message, buttons)

  // if (error instanceof Error) {
  //   data.dialogTitle = title
  //   data.details = details
  //   sendToBugsnag(error, data)
  // }

}

function errorSheet(message) {
  actionsSheetController.open(
    <ScrollView horizontal={true}>
      <View style={{width: 1000}}>
        <Text style={{fontFamily: 'monospace', color: colors.light}}>
          {message}
        </Text>
      </View>
    </ScrollView>,
    {error: true}
  )
}