/**
 * @format
 */

import './utils/sugar'
import {AppRegistry, LogBox} from 'react-native'
import {name as appName} from './app.json'
import settings from './src/settings' // preload
import DashboardView from './src/DashboardView.js'

LogBox.ignoreLogs([
  'Remote debugger',
  'Require cycle',
  'React state update on an unmounted component',
  'Async Storage has been extracted',
  'Clipboard has been extracted',
  'ListView is deprecated',
  'componentWillMount',
  "requireNativeComponent",
  "Animated: `useNativeDriver`",
  "componentWillUpdate",
  "Setting DrawerLayoutAndroid",
  "AsyncStorage has been",
  "componentWillReceiveProps",
  "Camera is accessing findNodeHandle",
  "VirtualizedList",
  "Switch:" // Switch: `onTintColor`/`thumbTintColor`/`onTintColor` is deprecated, use `trackColor` instead.
])

AppRegistry.registerComponent(appName,
  () => DashboardView
)
