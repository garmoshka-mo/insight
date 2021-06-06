/**@providesModule react-tuned
 */

import React, {Component as RawComponent} from 'react'
import autoBind from './autoBind'


export default React

export class Component extends RawComponent {
  constructor(props) {
    super(props)
    autoBind(this)
    if (!this.controllers)
      this.controllers = []
  }

  refresh = this.forceUpdate

  asyncSetState(newState) {
    return new Promise((resolve) => this.setState(newState, () => resolve()))
  }

  subscribeTo(...controllers) {
    controllers.forEach(controller =>
      this.controllers.push(controller)
    )
  }

  UNSAFE_componentWillMount() {
    this.controllers.each(controller => controller.subscribe(this))
  }

  componentWillUnmount() {
    this.unmounted = true
    this.controllers.each(controller => controller.unsubscribe(this))
  }

}
