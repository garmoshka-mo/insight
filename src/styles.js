import {  Appearance } from 'react-native'

export const colors = {
  light: '#d0d0d0',
  violet: '#860e0e',
  background: '#323232',
  selected: '#484848',
  disabled: '#484848',
  text: Appearance.getColorScheme() == 'dark' ?
    '#8f8f8f' : 'black'
}

export default {
  text: {color: colors.text}
}
