
import AppDispatcher from '../dispatcher.js';
import { userActionTypes } from '../constants';

export default {
  fetchSpaceUsers(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.SPACE_USERS_FETCH,
      spaceGuid: spaceGuid
    });
  },

  receivedSpaceUsers(users) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.SPACE_USERS_RECEIVED,
      users: users
    });
  }
};
