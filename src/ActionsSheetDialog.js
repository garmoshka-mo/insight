/** @providesModule ActionsSheetDialog
 **/

import ActionSheet from "react-native-actions-sheet"
import React, { Component } from "../utils/react-tuned"
import {Text, TouchableOpacity, View} from 'react-native'
import actionsSheetController from "./actionsSheetController"
import Icon from "react-native-vector-icons/FontAwesome"
import {colors} from './styles'

export default class ActionsSheetDialog extends Component {

  controllers = [actionsSheetController]

  render() {
    return (
      <ActionSheet
        containerStyle={{backgroundColor:
          actionsSheetController.error ? colors.bad : colors.background,
          zIndex: 10
        }}
        gestureEnabled={true}
        onClose={actionsSheetController.onCloseOnce}
        ref={actionsSheetController.ref}
      >
        <View style={{ paddingTop: 20, paddingBottom: 30}}>
          {this.content()}
        </View>
      </ActionSheet>
    )
  }

  content() {
    let { content } = actionsSheetController
    return <View style={{marginHorizontal: 25}}>
      {content}
    </View>
  }

  actions() {
    return Object.entries(actions).map(([name, handlerData]) => {
      if (this.isSeparator(name))
        return this.separator()

      return this.action(name, handlerData)
    })
  }

  isSeparator(name) {
    return name.startsWith('separator')
  }

  separator() {
    return <View
      key={'separator'}
      style={{
        marginVertical: 10,
        // borderBottomColor: colors.light,
        borderBottomWidth: 1
      }}/>
  }

  action(name, handlerData) {
    let {action, icon, disabled} = handlerData
    var onPress = () => this.doAction(action)
    let color = colors.base

    if (disabled) {
      color = colors.lightGray
      if (typeof disabled == 'string')
        onPress = () => showWarningFlash(t(disabled))
    }

    return (
      <TouchableOpacity
        key={name}
        style={{ flexDirection: 'row', alignItems: 'flex-end',
          marginHorizontal: 30,
          paddingVertical: 13 }}
        onPress={onPress}
      >
        <View style={{flex:1, alignItems: 'flex-end', marginRight: 10}}>
          <Text style={{ fontSize: 17, color }}>
            {name}
          </Text>
        </View >
        {icon && <Icon name={icon} size={24} style={{color}} />}
      </TouchableOpacity>
    )
  }

  async doAction(handler) {
    await handler() // await action reason: Alert window for ios hides with this window
    actionsSheetController.close()
  }

}