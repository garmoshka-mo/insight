/**
 * @format
 */

import './utils/sugar'
import {AppRegistry} from 'react-native'
import {name as appName} from './app.json'
import Main from './src/Main.js'

AppRegistry.registerComponent(appName,
  () => Main
)
