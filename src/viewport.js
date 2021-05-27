/** @providesModule viewport
 **/

import ComponentController from "./ComponentController"
import {createRef} from 'react'
import YamlNode from "./YamlNode";
import _ from "lodash";
import s from "./services";
import sample from "./sampleData";
import settings from "./settings";
import File from './File'

export default new class extends ComponentController {

  constructor(props) {
    super(props)
    this.preload()
    s.viewport = this
  }

  async preload() {
    if (settings.recentFileId) {
      var file = await File.load(settings.recentFileId)
      this.load(await file.data())
    } else {
      this.load(sample)
    }
  }

  load(data) {
    this.update({root: new YamlNode('root', data)})
  }

}
