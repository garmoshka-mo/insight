/** @providesModule ComponentController
 **/

import autoBind from './autoBind'

export default class ComponentController {
  constructor() {
    this._subscribers = []
    autoBind(this)
    this.init?.()
  }

  refresh() {
    this._subscribers.each(component => component.forceUpdate())
  }

  update(state) {
    Object.assign(this, state)
    this.refresh()
  }

}