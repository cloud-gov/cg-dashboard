
import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api.js';
import { orgActionTypes } from '../constants';

export default {

  fetchAll() {
    setTimeout(() => {
      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_FETCH
      });
    }, 1);
  },

  receivedOrgs(orgs) {
    AppDispatcher.handleServerAction({
      type: orgActionTypes.ORGS_RECEIVED,
      orgs: orgs
    });
  }
};
