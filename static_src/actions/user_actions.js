
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

  fetchOrgUserRoles(orgGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.ORG_USER_ROLES_FETCH,
      orgGuid: orgGuid
    });
  },

  fetchSpaceUsers(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.SPACE_USERS_FETCH,
      spaceGuid: spaceGuid
    });
  },

  receivedOrgUsers(users, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ORG_USERS_RECEIVED,
      users: users,
      orgGuid: orgGuid
    });
  },

  receivedOrgUserRoles(roles, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ORG_USER_ROLES_RECEIVED,
      orgUserRoles: roles,
      orgGuid: orgGuid
    });
  },

  receivedSpaceUsers(users, spaceGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.SPACE_USERS_RECEIVED,
      users: users,
      spaceGuid: spaceGuid
    });
  },

  deleteUser(userGuid, orgGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_DELETE,
      userGuid: userGuid,
      orgGuid: orgGuid
    });
  },

  deletedUser(userGuid, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_DELETED,
      userGuid: userGuid,
      orgGuid: orgGuid
    });
  },

  addUserRoles(roles, userGuid, resourceGuid, resourceType) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ROLES_ADD,
      roles: roles,
      userGuid: userGuid,
      resourceGuid: resourceGuid,
      resourceType: resourceType
    });
  },

  addedUserRoles(roles, userGuid, resourceType) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ROLES_ADDED,
      roles: roles,
      userGuid: userGuid,
      resourceType: resourceType
    });
  },

  deleteUserRoles(roles, userGuid, resourceGuid, resourceType) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ROLES_DELETE,
      roles: roles,
      userGuid: userGuid,
      resourceGuid: resourceGuid,
      resourceType: resourceType
    });
  },

  deletedUserRoles(roles, userGuid, resourceType) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ROLES_DELETED,
      roles: roles,
      userGuid: userGuid,
      resourceType: resourceType
    });
  },

  errorRemoveUser(userGuid, error) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ERROR_REMOVE_USER,
      userGuid: userGuid,
      error: error
    });
  }

};
