
/*
 * Actions for user entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { userActionTypes } from '../constants';

export default {
  fetchOrgUsers(orgGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.ORG_USERS_FETCH,
      orgGuid: orgGuid
    });
  },

  fetchSpaceUsers(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.SPACE_USERS_FETCH,
      spaceGuid: spaceGuid
    });
  },

  receivedUsers(users) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USERS_RECEIVED,
      users: users
    });
  }
};
