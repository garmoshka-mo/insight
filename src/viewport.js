/** @providesModule viewport
 **/

import ComponentController from "./ComponentController"
import {createRef} from 'react'
import YamlNode from "./YamlNode";
import _ from "lodash";
import s from "./services";
import sample, {forceSamle} from "./sampleData";
import settings from "./settings";
import File from './File'
import yaml from 'js-yaml'

export default new class extends ComponentController {

  constructor(props) {
    super(props)
    this.preload()
    s.viewport = this
  }

  async preload() {
    await settings.load()
    if (!forceSamle && settings.recentFileId) {
      var file = await File.load(settings.recentFileId)
      this.load(await file.data())
    } else {
      this.load(yaml.load(sample))
    }
  }

  load(data) {
    this.update({root: new YamlNode('root', data)})
  }

}
