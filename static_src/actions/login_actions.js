
import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api.js';
import { loginActionTypes } from '../constants';

export default {
  receivedStatus(status) {
    AppDispatcher.handleServerAction({
      type: loginActionTypes.RECEIVED_STATUS,
      status: status
    });
  }
};
