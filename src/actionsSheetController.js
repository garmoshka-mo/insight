/** @providesModule actionsSheetController
 **/

import ComponentController from "../utils/ComponentController"
import {createRef} from 'react'


class ActionsSheetController extends ComponentController {

  ref = createRef()

  open(content, options = {error: false}) {
    Object.assign(this, options)
    this.content = content
    this.refresh()
    this.ref.current?.show()
  }

  close() {
    this.ref.current?.hide()
  }

  onCloseOnce() {
    if (this.onClose) this.onClose()
    this.onClose = null
  }

}

export default new ActionsSheetController()