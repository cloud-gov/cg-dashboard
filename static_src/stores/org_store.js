
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
import Quicklook from '../models/quicklook';

class OrgStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._currentOrgGuid = null;
    this._data = new Immutable.List();
  }

  _registerToActions(action) {
    switch (action.type) {
      case orgActionTypes.ORG_FETCH: {
        this.load([cfApi.fetchOrg(action.orgGuid)]);
        this.emitChange();
        break;
      }

      case orgActionTypes.ORGS_FETCH: {
        AppDispatcher.waitFor([LoginStore.dispatchToken]);
        this.load([cfApi.fetchOrgs()]);
        this.emitChange();
        break;
      }

      case orgActionTypes.ORG_RECEIVED: {
        if (action.org) {
          this.merge('guid', action.org, () => { });
          this.emitChange();
        }
        break;
      }

      case orgActionTypes.ORGS_RECEIVED: {
        const updates = action.orgs.map((d) => {
          if (d.spaces) {
            return d;
          }
          const currentSpaces = this.get(d.guid) ? this.get(d.guid).spaces : null;
          if (currentSpaces) {
            return Object.assign(d, { spaces: currentSpaces });
          }
          return Object.assign(d, { spaces: [] });
        });
        cfApi.fetchOrgsSummaries(updates.map((u) => u.guid));
        // we don't set .fetching here because we triggered subsequent requests
        // and will just set .fetching to false when they come back
        this.mergeMany('guid', updates, () => {});
        break;
      }

      case orgActionTypes.ORGS_SUMMARIES_RECEIVED: {
        this.mergeMany('guid', action.orgs, (changed) => {
          if (changed) {
            const orgUpdates = this.updateOpenOrgs(this._currentOrgGuid);
            this.mergeMany('guid', orgUpdates, () => {});
          }
        });
        this.emitChange();
        break;
      }

      case orgActionTypes.ORG_TOGGLE_SPACE_MENU: {
        this._currentOrgGuid = action.orgGuid;
        const updates = this.updateOpenOrgs(action.orgGuid);
        this.mergeMany('guid', updates, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      case orgActionTypes.ORG_TOGGLE_QUICKLOOK: {
        const org = this.get(action.orgGuid);
        const orgQuicklook = org.quicklook || new Quicklook();
        const toggledOrg = { ...org,
          quicklook: orgQuicklook.merge({ open: !orgQuicklook.open })
        };
        this.merge('guid', toggledOrg, () => this.emitChange());
        break;
      }

      default:
        break;
    }
  }

  currentOrg() {
    return this.get(this._currentOrgGuid);
  }

  get currentOrgGuid() {
    return this._currentOrgGuid;
  }

  get currentOrgName() {
    const org = this.get(this._currentOrgGuid);
    if (!org) return '';
    return org.name;
  }

  updateOpenOrgs(openOrgGuid) {
    const allOrgs = this.getAll();
    const updates = allOrgs.map((org) => {
      if (org.guid === openOrgGuid) {
        return Object.assign({}, org, { space_menu_open: true });
      }
      return Object.assign({}, org, { space_menu_open: false });
    });
    return updates;
  }
}

const _OrgStore = new OrgStore();

export default _OrgStore;
