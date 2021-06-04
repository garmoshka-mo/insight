/**
 * @format
 */

import './utils/sugar'
import {AppRegistry} from 'react-native'
import {name as appName} from './app.json'
import settings from './src/settings' // preload
import Dashboard from './src/DashboardView.js'

AppRegistry.registerComponent(appName,
  () => Dashboard
)
