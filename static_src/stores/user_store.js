/*
 * Store for user data. Will store and update user data on changes from UI and
 * server.
 */

import Immutable from "immutable";

import BaseStore from "./base_store.js";
import { userActionTypes, errorActionTypes } from "../constants.js";

export class UserStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this.handleAction.bind(this));
    this.storeData = new Immutable.List();
    this.currentViewedType = "space_users";
    this.currentUserGUID = null;
    this.isCurrentUserAdmin = false;
    this.error = null;
    this.saving = false;
    this.inviteDisabled = false;
    this.usersSelectorDisabled = false;
    this.userListNotification = {};
    this.loadingRequests = {};
  }

  get loading() {
    return (
      !this.loadingRequests ||
      this.loadingRequests.currentUser ||
      this.loadingRequests.entityUsers ||
      this.loadingRequests.entityRoles
    );
  }

  handleAction(action) {
    switch (action.type) {
      case userActionTypes.ORG_USERS_FETCH: {
        this.loadingRequests.entityUsers = true;
        break;
      }

      case userActionTypes.ORG_USER_ROLES_FETCH: {
        this.loadingRequests.entityRoles = true;
        break;
      }

      case userActionTypes.SPACE_USER_ROLES_FETCH: {
        this.loadingRequests.entityRoles = true;
        break;
      }

      case userActionTypes.ORG_USER_ROLES_RECEIVED: {
        this.loadingRequests.entityRoles = false;
        this.associateUsersAndRolesToEntity(
          action.orgUserRoles,
          action.orgGuid,
          "organization_roles"
        );
        this.emitChange();
        break;
      }

      case userActionTypes.SPACE_USER_ROLES_RECEIVED: {
        // There is no SPACE_USERS_RECEIVED for now unlike orgs,
        // so we will set both loading entity rules to false.
        this.loadingRequests.entityUsers = false;
        this.loadingRequests.entityRoles = false;

        const { users, spaceGuid } = action;
        this.associateUsersAndRolesToEntity(users, spaceGuid, "space_roles");
        this.emitChange();
        break;
      }

      case userActionTypes.USER_INVITE_TRIGGER: {
        this.inviteDisabled = true;
        this.userListNotificationError = null;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ORG_ASSOCIATE: {
        this.emitChange();
        break;
      }

      case userActionTypes.USER_SPACE_ASSOCIATE: {
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ORG_ASSOCIATED: {
        const user = Object.assign(
          {},
          {
            guid: action.userGuid
          },
          action.user
        );
        this.associateUsersAndRolesToEntity(
          [user],
          action.entityGuid,
          "organization_roles"
        );
        this.emitChange();
        break;
      }

      case userActionTypes.USER_SPACE_ASSOCIATED: {
        const user = Object.assign({}, action.user, {
          guid: action.userGuid
        });
        this.associateUsersAndRolesToEntity(
          [user],
          action.entityGuid,
          "space_roles"
        );
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ROLES_ADD: {
        this.saving = true;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ROLES_ADDED: {
        this.saving = false;
        const user = this.get(action.userGuid);
        this.addUserRole(
          user,
          action.entityType,
          action.entityGuid,
          action.roles,
          () => this.emitChange()
        );
        break;
      }

      case userActionTypes.USER_ROLES_DELETE: {
        this.saving = true;
        const user = this.get(action.userGuid);
        if (user) {
          const savingUser = Object.assign({}, user, { saving: true });
          this.merge("guid", savingUser);
        }
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ROLES_DELETED: {
        this.saving = false;
        const user = this.get(action.userGuid);
        this.deleteUserRole(
          user,
          action.entityType,
          action.entityGuid,
          action.roles,
          () => this.emitChange()
        );
        break;
      }

      case userActionTypes.ORG_USERS_RECEIVED: {
        this.loadingRequests.entityUsers = false;
        const orgGuid = action.orgGuid;
        const orgUsers = action.users;

        const updatedUsers = orgUsers.map(orgUser =>
          Object.assign({}, orgUser, { orgGuid })
        );

        this.mergeMany("guid", updatedUsers, changed => {
          if (changed) {
            this.error = null;
          }
          this.emitChange();
        });
        break;
      }

      // TODO: this should not be happening in the user store
      case userActionTypes.USER_DELETE: {
        // Nothing should happen.
        break;
      }

      case userActionTypes.USER_DELETED: {
        this.delete(action.userGuid, changed => {
          if (changed) this.emitChange();
        });
        break;
      }

      case userActionTypes.USER_REMOVED_ALL_SPACE_ROLES: {
        const user = this.get(action.userGuid);
        if (user) {
          this.deleteProp(action.userGuid, "space_roles", () =>
            this.emitChange()
          );
        }
        break;
      }

      case userActionTypes.ERROR_REMOVE_USER: {
        this.error = action.error;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_INVITE_ERROR: {
        this.userListNotificationError = Object.assign({}, action.err, {
          contextualMessage: action.contextualMessage
        });
        this.usersSelectorDisabled = false;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_ROLE_CHANGE_ERROR: {
        this.saving = false;
        this.error = Object.assign({}, action.error, {
          description: action.message
        });

        this.emitChange();
        break;
      }

      case userActionTypes.USER_LIST_NOTICE_CREATED: {
        this.inviteDisabled = false;
        const noticeType = action.noticeType;
        const description = action.description;
        const notice = Object.assign({}, { noticeType }, { description });
        this.userListNotification = notice;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_LIST_NOTICE_DISMISSED: {
        this.userListNotification = {};
        this.emitChange();
        break;
      }

      case userActionTypes.CURRENT_USER_INFO_RECEIVED: {
        const guid = action.currentUser.user_id;
        const userInfo = Object.assign({}, action.currentUser, { guid });
        this.merge("guid", userInfo, () => {
          this.currentUserGUID = guid;

          // Always emit change
          this.emitChange();
        });
        break;
      }

      case userActionTypes.CURRENT_UAA_INFO_RECEIVED: {
        const uaaInfo = action.currentUaaInfo;
        this.isCurrentUserAdmin = false;

        if (uaaInfo.groups) {
          // Check for UAA permissions here.
          // If the response does not have and object in the groups array
          // with a display key that equals 'cloud_controller.admin',
          // then return is false.
          // If there is a proper response, then the return is true.
          this.isCurrentUserAdmin = !!uaaInfo.groups.find(
            group => group.display === "cloud_controller.admin"
          );
        }

        // Always emit change
        this.emitChange();
        break;
      }

      case userActionTypes.USER_FETCH: {
        this.merge("guid", { guid: action.userGuid, fetching: true });
        break;
      }

      case userActionTypes.USER_RECEIVED: {
        const receivedUser = Object.assign({}, action.user, {
          fetching: false
        });
        if (action.user) {
          this.merge("guid", receivedUser, () => this.emitChange());
        }
        break;
      }

      case userActionTypes.CURRENT_USER_FETCH: {
        this.loadingRequests.currentUser = true;
        this.emitChange();
        break;
      }

      case userActionTypes.CURRENT_USER_RECEIVED: {
        this.loadingRequests.currentUser = false;
        this.emitChange();
        break;
      }

      case userActionTypes.USER_CHANGE_VIEWED_TYPE: {
        if (this.currentViewedType !== action.userType) {
          this.currentViewedType = action.userType;
          this.emitChange();
        }
        break;
      }

      case errorActionTypes.CLEAR: {
        this.error = null;
        this.saving = false;
        this.userListNotification = {};
        this.userListNotificationError = null;
        this.loadingRequests = {};
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }

  associateUsersAndRolesToEntity(users, entityGuid, roleType) {
    const updatedUsers = this.mergeRoles(users, entityGuid, roleType);
    this.mergeMany("guid", updatedUsers, () => {});
  }

  addUserRole(user, entityType, entityGuid, addedRole, cb) {
    const updatedUser = user;
    if (updatedUser) {
      if (entityType === "space") {
        if (!updatedUser.space_roles) updatedUser.space_roles = {};
        const updatedRoles = new Set(user.space_roles[entityGuid] || []);
        updatedRoles.add(addedRole);
        updatedUser.space_roles[entityGuid] = Array.from(updatedRoles);
      } else {
        if (!updatedUser.roles) updatedUser.roles = {};
        const updatedRoles = new Set(user.roles[entityGuid] || []);
        updatedRoles.add(addedRole);
        updatedUser.roles[entityGuid] = Array.from(updatedRoles);
      }
      this.merge("guid", updatedUser, () => {});
      cb();
    }
  }

  deleteUserRole(user, entityType, entityGuid, deletedRole, cb) {
    const updatedUser = user;
    if (updatedUser) {
      let roles;
      if (entityType === "space") {
        roles = updatedUser.space_roles && updatedUser.space_roles[entityGuid];
      } else {
        roles = updatedUser.roles && updatedUser.roles[entityGuid];
      }
      if (roles) {
        const idx = deletedRole && roles.indexOf(deletedRole);
        if (idx > -1) {
          roles.splice(idx, 1);
        }
      }
      this.merge("guid", updatedUser, () => {});
      cb();
    }
  }

  /**
   * Get all users in a certain space
   */
  getAllInSpace(spaceGuid) {
    const usersInSpace = this.storeData.filter(
      user =>
        !!user.get("space_roles") && !!user.get("space_roles").get(spaceGuid)
    );
    return usersInSpace.toJS();
  }

  getAllInOrg(orgGuid) {
    const usersInOrg = this.storeData.filter(
      user => !!user.get("roles") && !!user.get("roles").get(orgGuid)
    );

    return usersInOrg.toJS();
  }

  getAllInOrgAndNotSpace() {
    const usersInOrg = this.storeData.toJS().filter(user => !user.space_roles);

    return usersInOrg;
  }

  getError() {
    return this.error;
  }

  get isLoadingCurrentUser() {
    return this.loadingRequests.currentUser === true;
  }

  getDefaultUserInfo(user) {
    return { guid: user.guid, username: user.username };
  }

  mergeRoles(roles, entityGuid, entityType) {
    return roles.map(role => {
      const user = Object.assign(
        {},
        this.get(role.guid) || this.getDefaultUserInfo(role)
      );
      const updatingRoles = role[entityType] || [];

      if (entityType === "space_roles") {
        if (!user.space_roles) user.space_roles = {};
        user.space_roles[entityGuid] = updatingRoles;
      } else {
        if (!user.roles) user.roles = {};
        user.roles[entityGuid] = updatingRoles;
      }
      return user;
    });
  }

  /*
   * Returns if a user with userGuid has ANY role within the enity of the
   * entityGuid.
   * @param {string} userGuid - The guid of the user.
   * @param {string} entityGuid - The guid of the entity (space or org) to
   * check roles for.
   * @param {string|array} roleToCheck - Either a single role as a string or
   * an array of roles to check if the user has ANY of the roles.
   * @return {boolean} Whether the user has the role.
   */
  hasRole(userGuid, entityGuid, roleToCheck) {
    if (this.isAdmin()) {
      return true;
    }

    let wrappedRoles = roleToCheck;
    if (!Array.isArray(roleToCheck)) {
      wrappedRoles = [roleToCheck];
    }

    const key = entityGuid;
    const user = this.get(userGuid);
    const roles = [
      ...((user && user.roles && user.roles[key]) || []),
      ...((user && user.space_roles && user.space_roles[key]) || [])
    ];
    return !!roles.find(role => wrappedRoles.includes(role));
  }

  isAdmin() {
    return this.isCurrentUserAdmin;
  }

  get isSaving() {
    return this.saving;
  }

  get currentUser() {
    return this.get(this.currentUserGUID);
  }

  get currentlyViewedType() {
    return this.currentViewedType;
  }
}

export default new UserStore();
