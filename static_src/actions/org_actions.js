
import AppDispatcher from '../dispatcher.js';
import cfApi from '../utils/cf_api.js';
import { orgActionTypes } from '../constants';

export default {

  fetchAll() {
    AppDispatcher.handleViewAction({
      type: orgActionTypes.ORGS_FETCH
    });

    cfApi.fetchOrgs();
  },

  receivedOrgs(orgs) {
    AppDispatcher.handleServerAction({
      type: orgActionTypes.ORGS_RECEIVED,
      orgs: orgs
    });
  }
};
