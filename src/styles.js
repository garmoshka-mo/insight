import {  Appearance } from 'react-native'

export const colors = {
  light: '#d0d0d0',
  link: '#8d700f',
  bad: '#860e0e',
  background: Appearance.getColorScheme() == 'dark' ?
    '#323232' : '#d0d0d0',
  menuBackground: Appearance.getColorScheme() == 'dark' ?
    '#262626' : '#d0d0d0',
  selected: '#484848',
  shadow: '#444',
  disabled: '#484848',
  text: Appearance.getColorScheme() == 'dark' ?
    '#8f8f8f' : 'black'
}

export default {
  text: {color: colors.text}
}
