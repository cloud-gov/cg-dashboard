
/*
 * Actions for space entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { spaceActionTypes } from '../constants.js';

export default {
  fetch(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACE_FETCH,
      spaceGuid
    });
  },

  fetchAll() {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACES_FETCH
    });
  },

  fetchAllForOrg(orgGuid) {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACES_FOR_ORG_FETCH,
      orgGuid
    });
  },

  receivedSpace(space) {
    AppDispatcher.handleServerAction({
      type: spaceActionTypes.SPACE_RECEIVED,
      space
    });
  },

  receivedSpaces(spaces) {
    AppDispatcher.handleServerAction({
      type: spaceActionTypes.SPACES_RECEIVED,
      spaces
    });
  },

  changeCurrentSpace(spaceGuid) {
    AppDispatcher.handleUIAction({
      type: spaceActionTypes.SPACE_CHANGE_CURRENT,
      spaceGuid
    });
  }
};
