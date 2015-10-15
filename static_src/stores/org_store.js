
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
  if (currents.length) {
    updates.forEach(function(update) {
      var same = currents.find(function(current) {
        return current.guid === update.guid;
      });
       
      same ? Object.assign(same, update) : currents.push(update);
    });
  } else {
    currents = updates;
  }
  return currents;
}

class OrgStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._data = [];
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
        var updates = this._formatSplitRes(action.orgs);
        this._data = merge(this._data, updates);
        this.emitChange();
        break;

      case orgActionTypes.ORG_CHANGE_CURRENT:
        this._currentOrgGuid = action.orgGuid;
        var org = this.get(action.orgGuid);
        if (org) {
          this.emitChange();
        }
        break;

      default:
        break;
    }
  }

  get(guid) {
    if (guid) {
      return this._data.find((org) => {
        return org.guid === guid;
      });
    }
  }

  getAll() {
    return this._data;
  }

  get currentOrgGuid() {
    return this._currentOrgGuid;
  }
}

let _OrgStore = new OrgStore();

export default _OrgStore;
