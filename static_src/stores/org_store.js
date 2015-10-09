
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
            _OrgStore._data.push(action.org);
          }
          this.emitChange();
        }
        break;

      case orgActionTypes.ORGS_RECEIVED:
        var updates = formatData(action.orgs);
        if (this._data.length) {
          updates.forEach((update) => {
            this._data.forEach((org) => {
              var toUpdate = true;
              if (update.guid === org.guid) {
                org = Object.assign(org, update);
                toUpdate = false;
              }
            });
            if (toUpdate) {
              this._data.push(update);
            }
          });   
        } else {
          this._data = updates;
        }
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
