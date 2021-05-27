/** @providesModule actionsSheetController
 **/

import ComponentController from "./ComponentController"
import {createRef} from 'react'


class ActionsSheetController extends ComponentController {

  ref = createRef()

  open(content) {
    this.content = content
    this.refresh()
    this.ref.current?.show()
  }

  hide() {
    this.ref.current?.hide()
  }

}

export default new ActionsSheetController()