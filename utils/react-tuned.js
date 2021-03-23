/**@providesModule react-tuned
 */

import React, {Component as RawComponent} from 'react'
import autoBind from './autoBind'


export default React

export class Component extends RawComponent {
  constructor(props) {
    super(props)
    autoBind(this)
    this.controllers = []
  }

  asyncSetState(newState) {
    return new Promise((resolve) => this.setState(newState, () => resolve()))
  }

  subscribeTo(...controllers) {
    controllers.forEach(controller =>
      this.controllers.push(controller)
    )
  }

  componentWillMount() {
    this.controllers.each(controller => {
      if (controller)
        controller._subscribers.push(this)
    })
  }

  componentWillUnmount() {
    this.unmounted = true
    this.controllers.each(controller => controller._subscribers.delete(this))
  }

}
