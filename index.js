/**
 * @format
 */

import './utils/sugar'
import {AppRegistry} from 'react-native'
import {name as appName} from './app.json'
import Dashboard from './src/Dashboard.js'

AppRegistry.registerComponent(appName,
  () => Dashboard
)
