
/*
 * Store to hold and update login status.
 */

import BaseStore from './base_store.js';
import { loginActionTypes } from '../constants.js';


class LoginStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._isAuthenticated = true;
  }

  _registerToActions(action) {
    switch (action.type) {
      case loginActionTypes.RECEIVED_STATUS:
        this._isAuthenticated = action.status;
        this.emitChange();
        break;

      default:
        break;
    }
  }

  isLoggedIn() {
    return !!this._isAuthenticated;
  }
}

const _LoginStore = new LoginStore();

export default _LoginStore;
