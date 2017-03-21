/*
 * Store for space data. Will store and update space data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import { orgActionTypes, spaceActionTypes } from '../constants.js';

class SpaceStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this._currentSpaceGuid = null;
    this._loading = [];
    this._fetchAll = false;
    this.subscribe(() => this._registerToActions.bind(this));
  }

  viewPermissionRoles() {
    return [
      'space_manager',
      'space_developer',
      'space_auditor'
    ];
  }

  get loading() {
    return !!this._loading.length || this._fetchAll;
  }

  // TODO this could be moved to a helper
  _startLoading(guid) {
    this._loading.push(guid);
  }

  // TODO this could be moved to a helper
  _completeLoading(guid) {
    const index = this._loading.indexOf(guid);
    if (index > -1) {
      // Maybe throw an error if the item isn't in the array
      this._loading.splice(index, 1);
    }
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
        this._startLoading(action.spaceGuid);
        this.emitChange();
        break;
      }

      case spaceActionTypes.SPACES_FETCH: {
        this._fetchAll = true;
        this.emitChange();
        break;
      }

      case spaceActionTypes.SPACE_RECEIVED: {
        this._completeLoading(action.space.guid);
        this.merge('guid', action.space, () => { });
        this.emitChange();
        break;
      }

      case spaceActionTypes.SPACES_RECEIVED: {
        this._fetchAll = false;
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
