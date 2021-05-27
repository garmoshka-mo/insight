/** @providesModule viewport
 **/

import ComponentController from "./ComponentController"
import {createRef} from 'react'
import YamlNode from "./YamlNode";
import _ from "lodash";
import sample from "./sampleData";


export default new class extends ComponentController {

  constructor(props) {
    super(props)
    this.load(sample)
  }

  load(data) {
    this.update({root: new YamlNode('root', data)})
  }

}
