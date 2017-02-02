
/*
 * Store for org data. Will store and update org data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import AppDispatcher from '../dispatcher';
import BaseStore from './base_store.js';
import LoginStore from './login_store.js';
import { orgActionTypes } from '../constants.js';
import Quicklook from '../models/quicklook';

class OrgStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._currentOrgGuid = null;
    this._data = new Immutable.List();
    this._fetchOrg = false;
    this._fetchAll = false;
  }

  get loading() {
    return this._fetchOrg || this._fetchAll;
  }

  _registerToActions(action) {
    switch (action.type) {
      case orgActionTypes.ORG_FETCH: {
        this._fetchOrg = true;
        this.emitChange();
        break;
      }

      case orgActionTypes.ORGS_FETCH: {
        AppDispatcher.waitFor([LoginStore.dispatchToken]);
        this._fetchAll = true;
        this.emitChange();
        break;
      }

      case orgActionTypes.ORG_RECEIVED: {
        this._fetchOrg = false;
        this.merge('guid', action.org || {}, () => {
          // Emit change regardless because loading state is updated
          this.emitChange();
        });
        break;
      }

      case orgActionTypes.ORGS_RECEIVED: {
        this._fetchAll = false;
        const updates = action.orgs.map((d) => {
          if (d.spaces) {
            return d;
          }

          const org = this.get(d.guid);
          return Object.assign(d, { spaces: org && org.spaces || [] });
        });
        this.mergeMany('guid', updates);
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
        const orgQuicklook = new Quicklook(org.quicklook || {});
        const toggledOrg = { ...org,
          quicklook: orgQuicklook.merge({ open: !orgQuicklook.open })
        };
        this.merge('guid', toggledOrg);
        break;
      }

      case orgActionTypes.ORG_TOGGLE_QUICKLOOK_SUCCESS: {
        const org = this.get(action.orgGuid);
        const orgQuicklook = new Quicklook(org.quicklook);
        const toggledOrg = { ...org,
          quicklook: orgQuicklook.merge({ isLoaded: true, error: null })
        };
        this.merge('guid', toggledOrg);
        break;
      }

      case orgActionTypes.ORG_TOGGLE_QUICKLOOK_ERROR: {
        const org = this.get(action.orgGuid);
        const orgQuicklook = org.quicklook;
        const toggledOrg = { ...org,
          quicklook: orgQuicklook.merge({ isLoaded: true, error: action.error })
        };
        this.merge('guid', toggledOrg);
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
