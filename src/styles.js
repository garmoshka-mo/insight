import {  Appearance } from 'react-native'

export const colors = {
  light: '#d0d0d0',
  violet: '#860e0e',
  background: '#323232',
  text: Appearance.getColorScheme() == 'dark' ?
    '#8f8f8f' : 'black'
}

export default {
  textColor: colors.text, // todo: use colors.text
  text: {color: colors.text}
}
