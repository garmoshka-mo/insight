import {  Appearance } from 'react-native'

export default {
  textColor: Appearance.getColorScheme() == 'dark' ? '#8f8f8f' : 'black'
}