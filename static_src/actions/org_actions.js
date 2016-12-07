
/*
 * Actions for organization entities. Any actions such as fetching, creating,
 * updating, etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { orgActionTypes } from '../constants';

export default {

  changeCurrentOrg(orgGuid) {
    AppDispatcher.handleViewAction({
      type: orgActionTypes.ORG_CHANGE_CURRENT,
      orgGuid
    });
  },

  fetch(orgGuid) {
    AppDispatcher.handleViewAction({
      type: orgActionTypes.ORG_FETCH,
      orgGuid
    });
  },

  fetchAll() {
    // TODO investigate more why timeout is needed here.
    // Currently being used to allow different actions to happen at same time.
    setTimeout(() => {
      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_FETCH
      });
    }, 1);
  },

  receivedOrg(org) {
    AppDispatcher.handleServerAction({
      type: orgActionTypes.ORG_RECEIVED,
      org
    });
  },

  receivedOrgs(orgs) {
    AppDispatcher.handleServerAction({
      type: orgActionTypes.ORGS_RECEIVED,
      orgs
    });
  },

  receivedOrgsSummaries(orgs) {
    AppDispatcher.handleServerAction({
      type: orgActionTypes.ORGS_SUMMARIES_RECEIVED,
      orgs
    });
  },

  toggleSpaceMenu(orgGuid) {
    AppDispatcher.handleUIAction({
      type: orgActionTypes.ORG_TOGGLE_SPACE_MENU,
      orgGuid
    });
  },

  toggleQuicklook(orgGuid) {
    AppDispatcher.handleUIAction({
      type: orgActionTypes.ORG_TOGGLE_QUICKLOOK,
      orgGuid
    });
  }
};
