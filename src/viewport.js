/** @providesModule viewport
 **/

import ComponentController from "./ComponentController"
import {createRef} from 'react'
import YamlNode from "./YamlNode";
import _ from "lodash";
import s from "./services";
import sampleData, {forceSample} from "./sampleData";
import settings from "./settings";
import File from './File'
import yaml from 'js-yaml'
import FileSample from "./FileSample";
import {logr} from "./commonFunctions";

export default new class extends ComponentController {

  constructor(props) {
    super(props)
    this.preload()
    s.viewport = this
  }

  async preload() {
    await settings.load()
    if (!forceSample && settings.recentFileId)
      var file = await File.load(settings.recentFileId)
    else
      file = new FileSample(sampleData)
    await this.loadToPort(file)
  }

  async loadToPort(file) {
    this.file = file
    this.update({root: null})
    var data = await file.parseData()
    this.update({root: new YamlNode('root', data)})
  }

  async save() {
    this.file.save(this.root.dump())
  }

}
