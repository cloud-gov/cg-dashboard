
/*
 * Actions for organization entities. Any actions such as fetching, creating,
 * updating, etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { orgActionTypes } from '../constants';
import spaceActions from './space_actions';

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

  toggleQuicklook(org) {
    AppDispatcher.handleUIAction({
      type: orgActionTypes.ORG_TOGGLE_QUICKLOOK,
      orgGuid: org.guid
    });

    let fetch = Promise.resolve();
    if (!org.quicklook || !org.quicklook.open) {
      // TODO only fetch if spaces haven't already been fetched
      fetch = spaceActions.fetchAllForOrg(org.guid);
    }

    fetch.then(() => {
      AppDispatcher.handleUIAction({
        type: orgActionTypes.ORG_TOGGLE_QUICKLOOK_SUCCESS,
        orgGuid: org.guid
      });
    });

    return fetch;
  }
};
