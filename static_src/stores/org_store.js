
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
        cfApi.fetchOrg(action.orgGuid);
        this.fetching = true;
        break;
      }

      case orgActionTypes.ORGS_FETCH: {
        AppDispatcher.waitFor([LoginStore.dispatchToken]);
        cfApi.fetchOrgs();
        this.fetching = true;
        break;
      }

      case orgActionTypes.ORG_RECEIVED: {
        this.fetching = false;
        if (action.org) {
          this.merge('guid', action.org, () => {});
        }
        break;
      }

      case orgActionTypes.ORGS_RECEIVED: {
        this.fetching = false;
        const updates = this.formatSplitResponse(action.orgs).map((d) => {
          if (d.spaces) {
            return d;
          }
          return Object.assign(d, { spaces: [] });
        });
        cfApi.fetchOrgsSummaries(updates.map((u) => u.guid));

        this.mergeMany('guid', updates, () => {});
        break;
      }

      case orgActionTypes.ORGS_SUMMARIES_RECEIVED: {
        this.fetching = false;
        this.mergeMany('guid', action.orgs, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      case orgActionTypes.ORG_CHANGE_CURRENT: {
        this._currentOrgGuid = action.orgGuid;
        this.emitChange();

        break;
      }

      case orgActionTypes.ORG_TOGGLE_SPACE_MENU: {
        const org = this.get(action.orgGuid);
        if (!org) {
          const allOrgs = this.getAll();
          const updates = allOrgs.map((sorg) =>
            Object.assign({}, sorg, { space_menu_open: false })
          );
          this.mergeMany('guid', updates, (changed) => {
            if (changed) this.emitChange();
          });
          break;
        }
        const otherOrgs = this.getAll().filter((sorg) => sorg.guid !== org.guid);
        const open = org.space_menu_open || false;
        const toUpdate = Object.assign(org, { space_menu_open: !open });
        const allUpdates = otherOrgs.map((otherOrg) =>
          Object.assign({}, otherOrg, { space_menu_open: false })
        );
        allUpdates.push(toUpdate);
        this.mergeMany('guid', allUpdates, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      default:
        break;
    }
  }

  get currentOrgGuid() {
    return this._currentOrgGuid;
  }
}

const _OrgStore = new OrgStore();

export default _OrgStore;
