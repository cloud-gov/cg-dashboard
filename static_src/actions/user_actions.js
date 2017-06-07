
/*
 * Actions for user entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import cfApi from '../util/cf_api';
import uaaApi from '../util/uaa_api';
import { userActionTypes } from '../constants';
import UserStore from '../stores/user_store';
import OrgStore from '../stores/org_store';

const userActions = {
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

  fetchSpaceUserRoles(spaceGuid) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.SPACE_USER_ROLES_FETCH,
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

  receivedSpaceUserRoles(users, spaceGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.SPACE_USER_ROLES_RECEIVED,
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

  fetchUserInvite(email) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_INVITE_FETCH,
      email
    });

    return uaaApi.inviteUaaUser(email)
      .then(data => userActions.receiveUserInvite(data))
      .catch(err => userActions.userInviteError(err, `There was a problem
        inviting ${email}`));
  },

  receiveUserInvite(inviteData) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_INVITE_RECEIVED
    });

    const userGuid = inviteData.new_invites[0].userId;
    const userEmail = inviteData.new_invites[0].email;

    return cfApi.postCreateNewUserWithGuid(userGuid)
      .then(user => userActions.receiveUserForCF(user, inviteData))
      .catch(err => userActions.userInviteError(err, `There was a problem
        inviting ${userEmail}`));
  },

  userInviteError(err, contextualMessage) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_INVITE_ERROR,
      err,
      contextualMessage
    });

    return Promise.resolve(err);
  },

  receiveUserForCF(user, inviteData) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_IN_CF_CREATED,
      user
    });

    if (user.guid) {
      userActions.sendUserInviteEmail(inviteData);
    }
    // Once the user exists in CF, associate them to the organization.
    return userActions.associateUserToOrg(user);
  },

  sendUserInviteEmail(inviteData) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_EMAIL_INVITE
    });
    uaaApi.sendInviteEmail(inviteData);
  },

  associateUserToOrg(user) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ORG_ASSOCIATE
    });
    const orgGuid = OrgStore.currentOrgGuid;

    return cfApi.putAssociateUserToOrganization(user.guid, orgGuid)
      .then(userActions.associatedUserToOrg(user, orgGuid))
      .catch(err => userActions.userInviteError(err, `Unable to associate user to
        organization`));
  },

  associatedUserToOrg(user, orgGuid) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ORG_ASSOCIATED,
      user,
      orgGuid
    });
  },

  changeCurrentlyViewedType(userType) {
    AppDispatcher.handleUIAction({
      type: userActionTypes.USER_CHANGE_VIEWED_TYPE,
      userType
    });
  },

  fetchCurrentUserInfo() {
    AppDispatcher.handleViewAction({
      type: userActionTypes.CURRENT_USER_INFO_FETCH
    });

    return uaaApi.fetchUserInfo()
      .then(userInfo => userActions.receivedCurrentUserInfo(userInfo));
  },

  receivedCurrentUserInfo(userInfo) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.CURRENT_USER_INFO_RECEIVED,
      currentUser: userInfo
    });

    return Promise.resolve(userInfo);
  },

  fetchCurrentUserUaaInfo(guid) {
    if (!guid) {
      return Promise.reject(new Error('guid is required'));
    }

    AppDispatcher.handleViewAction({
      type: userActionTypes.CURRENT_UAA_INFO_FETCH
    });

    return uaaApi.fetchUaaInfo(guid)
      .then(uaaInfo => userActions.receivedCurrentUserUaaInfo(uaaInfo));
  },

  receivedCurrentUserUaaInfo(uaaInfo) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.CURRENT_UAA_INFO_RECEIVED,
      currentUaaInfo: uaaInfo
    });

    return Promise.resolve(uaaInfo);
  },

  fetchUser(userGuid) {
    if (!userGuid) {
      return Promise.reject(new Error('userGuid is required'));
    }

    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_FETCH,
      userGuid
    });

    return cfApi.fetchUser(userGuid)
      .then(userActions.receivedUser);
  },

  receivedUser(user) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_RECEIVED,
      user
    });

    return Promise.resolve(user);
  },

  fetchCurrentUser() {
    AppDispatcher.handleViewAction({
      type: userActionTypes.CURRENT_USER_FETCH
    });

    // TODO add error action
    return userActions
      .fetchCurrentUserInfo()
      .then(userInfo =>
        Promise.all([
          userActions.fetchUser(userInfo.user_id),
          userActions.fetchCurrentUserUaaInfo(userInfo.user_id)
        ])
      )
      // Grab user from store with all merged properties
      .then(() => UserStore.currentUser)
      .then(userActions.receivedCurrentUser);
  },

  // Meta action that the current user is completely loaded
  receivedCurrentUser(user) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.CURRENT_USER_RECEIVED,
      user
    });

    return Promise.resolve(user);
  }
};

export default userActions;
