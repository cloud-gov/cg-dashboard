
import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import LoginStore from './login_store.js';
import { orgActionTypes } from '../constants.js';

function formatData(resources) {
  return resources.map((resource) => {
    return Object.assign(resource.entity, resource.metadata);
  });
}

function merge(currents, updates) {
  var merged = [];
  if (currents.length) {
    // TODO investigate faster the o^2 here.
    updates.forEach((update) => {
      var shouldAdd = true;
      currents.forEach((current) => {
        if (update.guid === current.guid) {
          merged.push(Object.assign(current, update));
          shouldAdd = false;
        } else {
          merged.push(current);
        }
      });
      if (shouldAdd) {
        merged.push(update);
      }
    });   
  } else {
    merged = updates;
  }
  return merged;
}

class OrgStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
    this._currentOrg = null;
    this._currentOrgGuid = null;
  }

  _registerToActions(action) {
    switch (action.type) {
      case orgActionTypes.ORG_FETCH:
        cfApi.fetchOrg(action.orgGuid);
        break;

      case orgActionTypes.ORGS_FETCH:
        AppDispatcher.waitFor([LoginStore.dispatchToken]);
        cfApi.fetchOrgs();
        break;

      case orgActionTypes.ORG_RECEIVED:
        if (action.org) {
          var toUpdate = this.get(action.org.guid);
          if (toUpdate) {
            toUpdate = Object.assign(toUpdate, action.org); 
          } else {
            this._data.push(action.org);
          }
          this.emitChange();
        }
        break;

      case orgActionTypes.ORGS_RECEIVED:
        var updates = formatData(action.orgs);
        this._data = merge(this._data, updates);
        this.emitChange();
        break;

      case orgActionTypes.ORG_CHANGE_CURRENT:
        this._currentOrgGuid = action.orgGuid;
        var org = this.get(action.orgGuid);
        if (org) {
          this._currentOrg = org;
          this.emitChange();
        }
        break;

      default:
        break;
    }
  }

  get(guid) {
    return this._data.find((org) => {
      return org.guid === guid;
    });
  }

  getAll() {
    return this._data;
  }

  get currentOrg() {
    return this._currentOrg;
  }
}

let _OrgStore = new OrgStore();

export default _OrgStore;
