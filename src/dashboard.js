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

  root = null

  constructor(props) {
    super(props)
    s.dashboard = this
  }

  async loadDashboard() {
    await settings.load()
    await files.loadList()
    await this.loadInitialFile()
    await auth.load()
  }

  async loadInitialFile() {
    if (!forceSample && settings.recentFileId)
      var file = files.fileById(settings.recentFileId)

    if (!file) file = new FileSample(sampleData)
    await this.displayFile(file)
  }

  async displayFile(file) {
    this.file = file
    if (this.root)
      this.root.unsubscribe(this)
    this.update({root: null})
    var data = await file.parseData()
    if (data) {
      this.update({root: new Node('root', data)})
      this.root.subscribe(this)
    }
  }

  async save() {
    this.file.save(this.root.dump())
  }

}
