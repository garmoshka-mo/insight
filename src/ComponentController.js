/** @providesModule ComponentController
 **/



export default class ComponentController {
  constructor() {
    this._subscribers = []
  }

  refresh() {
    this._subscribers.each(component => component.forceUpdate())
  }

  update(state) {
    Object.assign(this, state)
    this.refresh()
  }

}