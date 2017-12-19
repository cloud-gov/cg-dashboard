/*
 * Store for space data. Will store and update space data on changes from UI and
 * server.
 */

import Immutable from "immutable";
import PropTypes from "prop-types";

import BaseStore from "./base_store.js";
import { orgActionTypes, spaceActionTypes } from "../constants.js";

export const spacePropType = PropTypes.shape({
  guid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});

class SpaceStore extends BaseStore {
  constructor() {
    super();
    this.storeData = new Immutable.List();
    this.currentSpaceGUID = null;
    this.loadingGUIDs = [];
    this.isFetchingAll = false;
    this.cfName = "space_users";
    this.subscribe(() => this.handleAction.bind(this));
  }

  viewPermissionRoles() {
    return ["space_manager", "space_developer", "space_auditor"];
  }

  get loading() {
    return !!this.loadingGUIDs.length || this.isFetchingAll;
  }

  // TODO this could be moved to a helper
  startLoading(guid) {
    this.loadingGUIDs.push(guid);
  }

  // TODO this could be moved to a helper
  completeLoading(guid) {
    const index = this.loadingGUIDs.indexOf(guid);
    if (index > -1) {
      // Maybe throw an error if the item isn't in the array
      this.loadingGUIDs.splice(index, 1);
    }
  }

  handleAction(action) {
    switch (action.type) {
      case orgActionTypes.ORG_RECEIVED: {
        const spaces = action.org.spaces || [];
        const spacesWithOrgGuid = spaces.map(space => {
          const org = { org: action.org.guid };
          return Object.assign({}, space, org);
        });
        if (spacesWithOrgGuid.length > 0) {
          this.mergeMany("guid", spacesWithOrgGuid, changed => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case spaceActionTypes.SPACE_FETCH: {
        this.startLoading(action.spaceGuid);
        this.emitChange();
        break;
      }

      case spaceActionTypes.SPACES_FETCH: {
        this.isFetchingAll = true;
        this.emitChange();
        break;
      }

      case spaceActionTypes.SPACE_RECEIVED: {
        this.completeLoading(action.space.guid);
        this.merge("guid", action.space, () => {});
        this.emitChange();
        break;
      }

      case spaceActionTypes.SPACES_RECEIVED: {
        this.isFetchingAll = false;
        this.mergeMany("guid", action.spaces, () => {
          this.emitChange();
        });
        break;
      }

      case spaceActionTypes.SPACE_CHANGE_CURRENT: {
        this.currentSpaceGUID = action.spaceGuid;
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }

  currentSpace() {
    return this.get(this.currentSpaceGUID);
  }

  get currentSpaceGuid() {
    return this.currentSpaceGUID;
  }

  get currentSpaceName() {
    const space = this.get(this.currentSpaceGUID);
    if (!space) return "";
    return space.name;
  }
}

export default new SpaceStore();
