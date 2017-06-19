
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
import notificationActions from './notification_actions';

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

  addUserRoles(roles, apiKey, userGuid, entityGuid, entityType) {
    const apiMethodMap = {
      org: cfApi.putOrgUserPermissions,
      space: cfApi.putSpaceUserPermissions
    };
    const api = apiMethodMap[entityType];

    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ROLES_ADD,
      roles,
      userGuid,
      entityGuid,
      entityType
    });

    return api(
      userGuid,
      entityGuid,
      apiKey
    ).then(() => {
      userActions.addedUserRoles(
        roles,
        userGuid,
        entityGuid,
        entityType);
    }).catch((err) => {
      window.console.error(err);
    });
  },

  addedUserRoles(roles, userGuid, entityGuid, entityType) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ROLES_ADDED,
      roles,
      userGuid,
      entityGuid,
      entityType
    });
  },

  deleteUserRoles(roles, apiKey, userGuid, entityGuid, entityType) {
    const apiMethodMap = {
      org: cfApi.deleteOrgUserPermissions,
      space: cfApi.deleteSpaceUserPermissions
    };
    const api = apiMethodMap[entityType];

    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ROLES_DELETE,
      roles,
      userGuid,
      entityGuid,
      entityType
    });

    return api(
      userGuid,
      entityGuid,
      roles,
      apiKey
    ).catch((err) => {
      window.console.error(err);
    });
  },

  deletedUserRoles(roles, userGuid, entityGuid, entityType) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_ROLES_DELETED,
      roles,
      userGuid,
      entityGuid,
      entityType
    });
  },

  errorRemoveUser(userGuid, error) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.ERROR_REMOVE_USER,
      userGuid,
      error
    });
  },

  createUserInvite(email) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_INVITE_TRIGGER,
      email
    });

    return uaaApi.inviteUaaUser(email)
      .then(invite => userActions.receivedInviteStatus(invite, email))
      .catch(err => userActions.userInviteCreateError(err, `There was a problem
        inviting ${email}`));
  },

  receivedInviteStatus(invite, email) {
    const verified = invite.verified;
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_INVITE_STATUS_UPDATED,
      email,
      verified
    });

    return cfApi.fetchUser(invite.userGuid)
      .then(user => userActions.createUserAndAssociate(user))
      .then(() => userActions.createInviteNotification(verified, email))
      .catch(err => userActions.userInviteCreateError(err, `There was a problem
        inviting ${email}`));
  },

  createInviteNotification(verified, email) {
    let message;
    const currentViewedType = UserStore.currentlyViewedType;
    const viewTypeNoun = {
      org_users: {
        singular: 'organization'
      },
      space_users: {
        singular: 'space'
      }
    };
    if (verified) {
      message = `The account for ${email} is now associated to this ` +
        `${viewTypeNoun[currentViewedType].singular}. Control their ` +
        `${viewTypeNoun[currentViewedType].singular} roles below.`;
    } else {
      message = `There was no cloud.gov account found for ${email}` +
        '. They have been sent an email cloud.gov invitation. Their account ' +
        `has been associated to this ${viewTypeNoun[currentViewedType].singular}` +
        ` and their ${viewTypeNoun[currentViewedType].singular}` +
        ' roles can be controlled below.';
    }
    notificationActions.createNotification('finish', message);
  },

  userInviteError(err, contextualMessage) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_INVITE_ERROR,
      err,
      contextualMessage
    });

    return Promise.resolve(err);
  },

  createUserAndAssociate(user) {
    const orgGuid = OrgStore.currentOrgGuid;
    const userGuid = user.guid;
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ORG_ASSOCIATE,
      userGuid,
      orgGuid
    });
    return cfApi.putAssociateUserToOrganization(userGuid, orgGuid)
      .then(userActions.createdUserAndAssociated(userGuid, orgGuid, user));
  },

  createdUserAndAssociated(userGuid, orgGuid, user) {
    AppDispatcher.handleViewAction({
      type: userActionTypes.USER_ORG_ASSOCIATED,
      userGuid,
      orgGuid,
      user
    });
    return Promise.resolve(user);
  },

  userInviteCreateError(err, contextualMessage) {
    AppDispatcher.handleServerAction({
      type: userActionTypes.USER_INVITE_ERROR,
      err,
      contextualMessage
    });

    return Promise.resolve(err);
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

const _userActions = userActions;
window.useraction = _userActions;

export default userActions;
