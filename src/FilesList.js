import React, {Component} from "../utils/react-tuned"
import {View, Text, FlatList} from 'react-native'
import sample from './sampleData'
import _ from 'lodash'
import YamlNode from "./YamlNode"
import Dropbox from "./Dropbox";
import {logr} from "./commonFunctions";
import ActionsSheetDialog from './ActionsSheetDialog'
import Menu from './Menu'

export default class extends Component {

  render() {
    return <View>
      <Text>

        The Centennial Hall (Polish: Hala Stulecia [ˈxala stuˈlɛtɕa]; German: Jahrhunderthalle [jaːɐ̯ˈhʊndɐthalə]), formerly named Hala Ludowa ("People's Hall"), is a historic building in Wrocław, Poland. It was constructed according to the plans of architect Max Berg in 1911–1913, when the city was part of the German Empire. Max Berg designed Centennial Hall to serve as a multifunctional structure to host "exhibitions, concerts, theatrical and opera performances, and sporting events".[1] The hall continues to be used for sporting events and concerts.

        As an early landmark of reinforced concrete architecture, the building became one of Poland's official national Historic Monuments (Pomnik historii), as designated 20 April 2005, together with the Four Domes Pavilion, the Pergola, and the Iglica. Its listing is maintained by the National Heritage Board of Poland. It was also listed as a UNESCO World Heritage Site in 2006. The Hall is often cited as one of the early examples of expressionist architecture.
        As an early landmark of reinforced concrete architecture, the building became one of Poland's official national Historic Monuments (Pomnik historii), as designated 20 April 2005, together with the Four Domes Pavilion, the Pergola, and the Iglica. Its listing is maintained by the National Heritage Board of Poland. It was also listed as a UNESCO World Heritage Site in 2006. The Hall is often cited as one of the early examples of expressionist architecture.

      </Text>
    </View>
  }

}