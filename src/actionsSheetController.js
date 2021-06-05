/** @providesModule actionsSheetController
 **/

import ComponentController from "./utils/ComponentController"
import {createRef} from 'react'


class ActionsSheetController extends ComponentController {

  ref = createRef()

  open(content, options = {error: false}) {
    Object.assign(this, options)
    this.content = content
    this.refresh()
    this.ref.current?.show()
  }

  hide() {
    this.ref.current?.hide()
  }

}

export default new ActionsSheetController()