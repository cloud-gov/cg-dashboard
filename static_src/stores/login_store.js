
/*
 * Store to hold and update login status.
 */

import BaseStore from './base_store.js';
import { loginActionTypes } from '../constants.js';


export class LoginStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    // TODO this should probably be false, but we need to account for the
    // initial state (not loaded/unknown).
    this._isAuthenticated = true;
    this._error = null;
  }

  _registerToActions(action) {
    switch (action.type) {
      case loginActionTypes.FETCH_STATUS:
        // Reset any error
        this._error = null;
        this.emitChange();
        break;

      case loginActionTypes.RECEIVED_STATUS:
        this._isAuthenticated = action.authStatus.status === 'authorized';
        this.emitChange();
        break;

      case loginActionTypes.ERROR_STATUS:
        // Login status is unknown. If we have a login status, leave it as is
        // and hope things go smooth. A notification is handled elsewhere.
        this._error = action.err;
        break;

      default:
        break;
    }
  }

  get error() {
    return this._error;
  }

  isLoggedIn() {
    return !!this._isAuthenticated;
  }
}

const _LoginStore = new LoginStore();

export default _LoginStore;
