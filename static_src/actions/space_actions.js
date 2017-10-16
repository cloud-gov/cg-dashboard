
/*
 * Actions for space entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api';
import errorActions from './error_actions.js';
import { spaceActionTypes } from '../constants.js';
import SpaceStore from '../stores/space_store';

export default {
  fetch(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACE_FETCH,
      spaceGuid
    });

    return cfApi.fetchSpace(spaceGuid)
      .then(this.receivedSpace)
      .catch((err) => {
        errorActions.importantDataFetchError(err, 'unable to fetch space');

        throw err;
      });
  },

  fetchAll() {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACES_FETCH
    });

    return cfApi.fetchSpaces()
      .then(this.receivedSpaces)
      .catch((err) => {
        errorActions.importantDataFetchError(err, 'space data may be incomplete');

        throw err;
      });
  },

  fetchAllForOrg(orgGuid) {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACES_FOR_ORG_FETCH,
      orgGuid
    });

    return Promise.all(SpaceStore.getAll()
      .filter(space => space.organization_guid === orgGuid)
      .map(space => this.fetch(space.guid))
    )
    .catch((err) => {
      errorActions.importantDataFetchError(err, 'space data may be incomplete');

      throw err;
    });
  },

  receivedSpace(space) {
    AppDispatcher.handleServerAction({
      type: spaceActionTypes.SPACE_RECEIVED,
      space
    });

    return Promise.resolve(space);
  },

  receivedSpaces(spaces) {
    AppDispatcher.handleServerAction({
      type: spaceActionTypes.SPACES_RECEIVED,
      spaces
    });

    return Promise.resolve(spaces);
  },

  changeCurrentSpace(spaceGuid) {
    AppDispatcher.handleUIAction({
      type: spaceActionTypes.SPACE_CHANGE_CURRENT,
      spaceGuid
    });

    return Promise.resolve(spaceGuid || null);
  }
};
