/*
 * Store for space data. Will store and update space data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { orgActionTypes, spaceActionTypes } from '../constants.js';

class SpaceStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this._currentSpaceGuid = null;
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case orgActionTypes.ORG_RECEIVED: {
        const spaces = action.org.spaces || [];
        const spacesWithOrgGuid = spaces.map((space) => {
          const org = { org: action.org.guid };
          return Object.assign({}, space, org);
        });
        if (spacesWithOrgGuid.length > 0) {
          this.mergeMany('guid', spacesWithOrgGuid, (changed) => {
            if (changed) this.emitChange();
          });
        }
        break;
      }

      case spaceActionTypes.SPACE_FETCH: {
        this.load([cfApi.fetchSpace(action.spaceGuid)]);
        this.emitChange();
        break;
      }

      case spaceActionTypes.SPACES_FETCH: {
        this.load([cfApi.fetchSpaces()]);
        this.emitChange();
        break;
      }

      case spaceActionTypes.SPACES_FOR_ORG_FETCH: {
        const orgSpaces = this.getAll().filter((space) =>
          space.organization_guid === action.orgGuid);
        if (orgSpaces.length) {
          const spaceRequests = orgSpaces.map((orgSpace) =>
            cfApi.fetchSpace(orgSpace.guid));
          this.load(spaceRequests);
        }
        break;
      }

      case spaceActionTypes.SPACE_RECEIVED: {
        this.merge('guid', action.space, () => { });
        this.emitChange();
        break;
      }

      case spaceActionTypes.SPACES_RECEIVED: {
        this.mergeMany('guid', action.spaces, () => {
          this.emitChange();
        });
        break;
      }

      case spaceActionTypes.SPACE_CHANGE_CURRENT: {
        this._currentSpaceGuid = action.spaceGuid;
        this.emitChange();
        break;
      }

      default:
        break;
    }
  }

  currentSpace() {
    return this.get(this._currentSpaceGuid);
  }

  get currentSpaceGuid() {
    return this._currentSpaceGuid;
  }

  get currentSpaceName() {
    const space = this.get(this._currentSpaceGuid);
    if (!space) return '';
    return space.name;
  }
}

const _SpaceStore = new SpaceStore();

export default _SpaceStore;
