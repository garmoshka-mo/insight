/** @providesModule dashboard
 **/

import React, {Component} from "../utils/react-tuned"
import ComponentController from "../utils/ComponentController"
import Node from "./Node";
import s from "./services";
import sampleData, {forceSample} from "./sampleData";
import settings from "./settings";
import FileSample from "./FileSample";
import files from "./files";
import auth from "./auth";
import NodesList from "./views/NodesList";

export default new class Dashboard extends ComponentController {

  root = null
  scrollRef = null
  routes = [<NodesList/>]
  showArchived = false

  constructor(props) {
    super(props)
    s.dashboard = this
  }

  get dataSource() {
    return this.root.children
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

  scrollTo(y) {
    this.scrollRef.scrollTo({y})
  }

}
