
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
      orgGuid
    });
  },

  fetchOrgUserRoles(orgGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.ORG_USER_ROLES_FETCH,
      orgGuid
    });
  },

  fetchSpaceUsers(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.SPACE_USERS_FETCH,
      spaceGuid
    });
  },

  receivedOrgUsers(users, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ORG_USERS_RECEIVED,
      users,
      orgGuid
    });
  },

  receivedOrgUserRoles(roles, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ORG_USER_ROLES_RECEIVED,
      orgUserRoles: roles,
      orgGuid
    });
  },

  receivedSpaceUsers(users, spaceGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.SPACE_USERS_RECEIVED,
      users,
      spaceGuid
    });
  },

  deleteUser(userGuid, orgGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_DELETE,
      userGuid,
      orgGuid
    });
  },

  deletedUser(userGuid, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_DELETED,
      userGuid,
      orgGuid
    });
  },

  addUserRoles(roles, userGuid, resourceGuid, resourceType) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ROLES_ADD,
      roles,
      userGuid,
      resourceGuid,
      resourceType
    });
  },

  addedUserRoles(roles, userGuid, resourceType) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ROLES_ADDED,
      roles,
      userGuid,
      resourceType
    });
  },

  deleteUserRoles(roles, userGuid, resourceGuid, resourceType) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ROLES_DELETE,
      roles,
      userGuid,
      resourceGuid,
      resourceType
    });
  },

  deletedUserRoles(roles, userGuid, resourceType) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ROLES_DELETED,
      roles,
      userGuid,
      resourceType
    });
  },

  errorRemoveUser(userGuid, error) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ERROR_REMOVE_USER,
      userGuid,
      error
    });
  },

  changeCurrentlyViewedType(userType) {
    AppDispatcher.handleUIAction({
      type: userActionTypes.USER_CHANGE_VIEWED_TYPE,
      userType
    });
  }
};
