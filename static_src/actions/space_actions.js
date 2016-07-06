
/*
 * Actions for space entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api.js';
import { spaceActionTypes } from '../constants.js';

export default {
  fetch(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: spaceActionTypes.SPACE_FETCH,
      spaceGuid: spaceGuid
    });

    cfApi.fetchSpace(spaceGuid);
  },

  receivedSpace(space) {
    AppDispatcher.handleServerAction({
      type: spaceActionTypes.SPACE_RECEIVED,
      space: space
    });
  },

  changeCurrentSpace(spaceGuid) {
    AppDispatcher.handleUIAction({
      type: spaceActionTypes.SPACE_CHANGE_CURRENT,
      spaceGuid: spaceGuid
    });
  }
};
