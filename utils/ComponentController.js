/** @providesModule ComponentController
 **/

import autoBind from './autoBind'

export default class ComponentController {
  constructor(params) {
    this._subscribers = []
    autoBind(this)
    this.init?.(params)
  }

  subscribe(subscriber) {
    this._subscribers.push(subscriber)
  }

  unsubscribe(subscriber) {
    this._subscribers.delete(subscriber)
  }

  refresh() {
    this._subscribers.each(subscriber => subscriber.refresh())
  }

  update(state) {
    Object.assign(this, state)
    this.refresh()
  }

}