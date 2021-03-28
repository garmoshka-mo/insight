/** @providesModule auth
 **/

import ComponentController from './ComponentController'

class Auth extends ComponentController {

  authenticate(token) {
    this.update({ token })
  }

  get isAuthenticated() {
    return !!this.token
  }

}

export default new Auth()