/** @providesModule ComponentController
 **/

import autoBind from './autoBind'

export default class ComponentController {
  constructor(props) {
    this._subscribers = []
    this.init(props)
    if(this.constructor._applyAutoBind !== false)
      autoBind(this)
  }

  init(props) {}

  refresh() {
    this._subscribers.each(component => component.forceUpdate())
  }

  update(state) {
    Object.assign(this, state)
    this.refresh()
  }

}