/**
 * @format
 */

import './utils/sugar'
import {AppRegistry} from 'react-native'
import YamlView from './src/YamlView'
import {name as appName} from './app.json'

AppRegistry.registerComponent(appName,
  () => YamlView
)
