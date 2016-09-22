
/*
 * Actions for login information such as login status. Actions for getting and
 * modifying login information should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { loginActionTypes } from '../constants';

export default {
  receivedStatus(status) {
    AppDispatcher.handleServerAction({
      type: loginActionTypes.RECEIVED_STATUS,
      status
    });
  }
};
