
/*
 * Store for org data. Will store and update org data on changes from UI and
 * server.
 */

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
        this._data = this._merge(this._data, updates);
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

  get currentOrgGuid() {
    return this._currentOrgGuid;
  }
}

let _OrgStore = new OrgStore();

export default _OrgStore;
