
import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api.js';
import { loginActionTypes } from '../constants';

export default {
  fetchStatus() {
    AppDispatcher.handleViewAction({
      type: loginActionTypes.FETCH_STATUS
    });

    cfApi.getAuthStatus();
  },

  receivedStatus(status) {
    AppDispatcher.handleServerAction({
      type: loginActionTypes.RECEIVED_STATUS,
      status: status
    });
  }
};
