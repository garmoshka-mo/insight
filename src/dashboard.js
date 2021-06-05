/** @providesModule dashboard
 **/

import ComponentController from "../utils/ComponentController"
import {createRef} from 'react'
import Node from "./Node";
import _ from "lodash";
import s from "./services";
import sampleData, {forceSample} from "./sampleData";
import settings from "./settings";
import File from './File'
import FileSample from "./FileSample";
import {logr} from "./commonFunctions";
import files from "./files";
import auth from "./auth";

export default new class extends ComponentController {

  constructor(props) {
    super(props)
    s.dashboard = this
  }

  async loadDashboard() {
    // await files.resetFiles()
    await files.loadList()
    await auth.load()
    await settings.load()
    if (!forceSample && settings.recentFileId)
      var file = await File.byId(settings.recentFileId)
    else
      file = new FileSample(sampleData)
    await this.loadToPort(file)
  }

  async loadToPort(file) {
    this.file = file
    this.update({root: null})
    var data = await file.parseData()
    this.update({root: new Node('root', data)})
  }

  async save() {
    this.file.save(this.root.dump())
  }

}
