/** @providesModule viewport
 **/

import ComponentController from "./ComponentController"
import {createRef} from 'react'
import YamlNode from "./YamlNode";
import _ from "lodash";
import s from "./services";
import sample, {forceSample} from "./sampleData";
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
    if (!forceSample && settings.recentFileId) {
      var file = await File.load(settings.recentFileId)
      await this.loadToPort(file)
    } else {
      this.load(yaml.load(sample))
    }
  }

  async loadToPort(file) {
    this.file = file
    this.update({root: null})
    var data = await file.data()
    this.update({root: new YamlNode('root', data)})
  }

}
