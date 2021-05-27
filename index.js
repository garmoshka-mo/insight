/**
 * @format
 */

import './utils/sugar'
import {AppRegistry} from 'react-native'
import {name as appName} from './app.json'
import settings from './src/settings' // preload
import Dashboard from './src/Dashboard.js'

AppRegistry.registerComponent(appName,
  () => Dashboard
)
