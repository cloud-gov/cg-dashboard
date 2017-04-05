
/*
 * Actions for login information such as login status. Actions for getting and
 * modifying login information should go here.
 */

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api';
import { loginActionTypes } from '../constants';

const loginActions = {
  fetchStatus() {
    AppDispatcher.handleViewAction({
      type: loginActionTypes.FETCH_STATUS
    });

    return cfApi.getAuthStatus()
      .then(loginActions.receivedStatus)
      .catch(loginActions.errorStatus);
  },

  receivedStatus(authStatus) {
    AppDispatcher.handleServerAction({
      type: loginActionTypes.RECEIVED_STATUS,
      authStatus
    });

    return Promise.resolve(authStatus);
  },

  errorStatus(err) {
    AppDispatcher.handleServerAction({
      type: loginActionTypes.ERROR_STATUS,
      err
    });

    // Don't return the error since caller is expecting a login status.
    // undefined return is important to indicate an error occurred.
    return Promise.resolve();
  }
};

export default loginActions;
