
/*
 * Actions for organization entities. Any actions such as fetching, creating,
 * updating, etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api.js';
import errorActions from './error_actions.js';
import { orgActionTypes } from '../constants';
import spaceActions from './space_actions';

const orgActions = {

  changeCurrentOrg(orgGuid) {
    AppDispatcher.handleViewAction({
      type: orgActionTypes.ORG_CHANGE_CURRENT,
      orgGuid
    });

    return Promise.resolve(orgGuid);
  },

  fetch(orgGuid) {
    AppDispatcher.handleViewAction({
      type: orgActionTypes.ORG_FETCH,
      orgGuid
    });

    return cfApi.fetchOrg(orgGuid)
      .then(orgActions.receivedOrg)
      .catch((err) => {
        errorActions.importantDataFetchError(
          err,
          'organization data may be incomplete'
        );

        throw err;
      });
  },

  fetchAll() {
    AppDispatcher.handleViewAction({
      type: orgActionTypes.ORGS_FETCH
    });

    return cfApi.fetchOrgs()
      .then(orgs =>
        Promise.all(
          orgs.map(
            org =>
              cfApi.fetchOrgSummary(org.guid).then(summary => Object.assign({}, org, summary))
          )
        )
      )
      .then(orgActions.receivedOrgs)
      .catch((err) => {
        errorActions.importantDataFetchError(
          err,
          'unable to fetch organizations'
        );

        throw err;
      });
  },

  receivedOrg(org) {
    AppDispatcher.handleServerAction({
      type: orgActionTypes.ORG_RECEIVED,
      org
    });

    return Promise.resolve(org);
  },

  receivedOrgs(orgs) {
    AppDispatcher.handleServerAction({
      type: orgActionTypes.ORGS_RECEIVED,
      orgs
    });

    return Promise.resolve(orgs);
  },

  toggleSpaceMenu(orgGuid) {
    AppDispatcher.handleUIAction({
      type: orgActionTypes.ORG_TOGGLE_SPACE_MENU,
      orgGuid
    });

    return Promise.resolve(orgGuid);
  },

  toggleQuicklook(org) {
    AppDispatcher.handleUIAction({
      type: orgActionTypes.ORG_TOGGLE_QUICKLOOK,
      orgGuid: org.guid
    });

    let fetch = Promise.resolve();
    if (!org.quicklook || !org.quicklook.isLoaded) {
      fetch = spaceActions.fetchAllForOrg(org.guid);
    }

    return fetch.then(
      () => this.toggleQuicklookSuccess(org.guid),
      (err) => this.toggleQuicklookError(org.guid, err)
    );
  },

  toggleQuicklookSuccess(orgGuid) {
    AppDispatcher.handleUIAction({
      type: orgActionTypes.ORG_TOGGLE_QUICKLOOK_SUCCESS,
      orgGuid
    });

    return Promise.resolve(orgGuid);
  },

  toggleQuicklookError(orgGuid, err) {
    AppDispatcher.handleUIAction({
      type: orgActionTypes.ORG_TOGGLE_QUICKLOOK_ERROR,
      orgGuid,
      err
    });

    return Promise.resolve();
  }
};

export default orgActions;
