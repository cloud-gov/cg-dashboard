
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
      case orgActionTypes.ORGS_FETCH:
        AppDispatcher.waitFor([LoginStore.dispatchToken]);
        cfApi.fetchOrgs();
        break;

      case orgActionTypes.ORGS_RECEIVED:
        this._data = formatData(action.orgs);
        if (this._currentOrgGuid) {
          this._currentOrg = this.get(this._currentOrgGuid) || null;
        }
        else {
          this._currentOrg = this._data[0];
        }
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
