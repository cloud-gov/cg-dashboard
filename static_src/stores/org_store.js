
/*
 * Store for org data. Will store and update org data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

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
    this._currentOrgGuid = null;
    this._data = Immutable.List();
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
        debugger;
        if (action.org) this.merge('guid', action.org, (changed) => {
          if (changed) this.emitChange();
        });
        break;

      case orgActionTypes.ORGS_RECEIVED:
        let updates = this.formatSplitResponse(action.orgs).map((d) => {
          if (d.spaces) {
            return d;
          }
          return Object.assign(d, { spaces: []});
        });
        cfApi.fetchOrgsSummaries(updates.map((u) => { return u.guid; }));

        this.mergeMany('guid', updates, (changed) => {
          if (changed) this.emitChange();
        });
        break;

      case orgActionTypes.ORGS_SUMMARIES_RECEIVED:
        this.mergeMany('guid', actions.orgs, (changed) => {
          if (changed) this.emitChange();
        });
        break;

      case orgActionTypes.ORG_CHANGE_CURRENT:
        this._currentOrgGuid = action.orgGuid;
        if (this.get(action.orgGuid)) {
          this.emitChange();
        }
        break;

      case orgActionTypes.ORG_TOGGLE_SPACE_MENU:
        let org = this.get(action.orgGuid);
        let open = org.space_menu_open || false;
        let toUpdate = Object.assign(org, { space_menu_open: !open });
        this.merge('guid', toUpdate, (changed) => {
          if (changed) this.emitChange();
        });
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
