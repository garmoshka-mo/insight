/** @providesModule ComponentController
 **/

import autoBind from './autoBind'

export default class ComponentController {
  constructor(params) {
    this._subscribers = []
    autoBind(this)
    this.init?.(params)
  }

  refresh() {
    this._subscribers.each(component => component.forceUpdate())
  }

  update(state) {
    Object.assign(this, state)
    this.refresh()
  }

}