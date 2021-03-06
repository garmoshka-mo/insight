/** @providesModule NodesList
 **/

import React, {Component} from "../../utils/react-tuned"
import { Dimensions, ScrollView} from 'react-native'
import dashboard from "../dashboard";
import {swipeController} from "../../utils/ComponentController";

export default class extends Component {

  controllers = [swipeController, dashboard]

  render() {
    return <ScrollView
      ref={ref => dashboard.scrollRef = ref }
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 15,
        paddingBottom: Dimensions.get('window').height / 2
      }}
      scrollEnabled={!swipeController.swipeStarted}
      keyboardShouldPersistTaps="always"
    >
      { this.nodes() }
    </ScrollView>
  }

  nodes() {
    return dashboard.dataSource.map(node => node.render())
  }


}