/** @providesModule Main
 **/

import React, {Component} from "../utils/react-tuned"
import { View } from 'react-native'
import YamlView from "./YamlView";
import DropboxAuth from './DropboxAuth'


export default class extends Component {


  render() {
    return (
      <View>
        <DropboxAuth />
        <YamlView />
      </View>
    )
  }
}