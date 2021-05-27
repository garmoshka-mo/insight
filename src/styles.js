import {  Appearance } from 'react-native'

const styles = {
  textColor: Appearance.getColorScheme() == 'dark' ? '#8f8f8f' : 'black',
}

styles.text = {color: styles.textColor}

export default styles