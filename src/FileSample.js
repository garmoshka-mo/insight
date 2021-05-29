/** @providesModule FileSample
 **/

import File from "./File";
import {logr, showFlash} from "./commonFunctions";
import yaml from "js-yaml";

export default class extends File {

  constructor(data) {
    super({})
    this._data = data
    this.id = 'sample'
  }

  data() {
    return this._data
  }

  async openFile() {
    throw('not implemented for FileSample')
  }

  updateMeta(data) {
    throw('not implemented for FileSample')
  }

  async save(obj) {
    logr('SampleFile yaml\n', yaml.dump(obj))
    showFlash('SampleFile yaml printed in console')
  }

  async upload() {
    throw('not implemented for FileSample')
  }

}