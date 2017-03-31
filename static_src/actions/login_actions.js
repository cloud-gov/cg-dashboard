
/*
 * Actions for login information such as login status. Actions for getting and
 * modifying login information should go here.
 */

import AppDispatcher from '../dispatcher.js';
import errorActions from './error_actions';
import { loginActionTypes } from '../constants';

export default {
  receivedStatus(status) {
    AppDispatcher.handleServerAction({
      type: loginActionTypes.RECEIVED_STATUS,
      status
    });
  },

  errorStatus(err) {
    AppDispatcher.handleServerAction({
      type: loginActionTypes.ERROR_STATUS,
      err
    });

    return errorActions.notifyError(err)
      // Don't return the error since caller is expecting a login status.
      .then(() => null);
  }
};
