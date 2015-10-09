
import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api.js';
import { orgActionTypes } from '../constants';

export default {

  changeCurrentOrg(orgGuid) {
    AppDispatcher.handleViewAction({
      type: orgActionTypes.ORG_CHANGE_CURRENT,
      orgGuid: orgGuid
    });
  },

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
  },

  receivedOrg(org) {

  }
};
