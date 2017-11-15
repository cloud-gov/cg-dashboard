/*
 * Store for org data. Will store and update org data on changes from UI and
 * server.
 */
import PropTypes from "prop-types";

import AppDispatcher from "../dispatcher";
import BaseStore from "./base_store.js";
import LoginStore from "./login_store.js";
import { orgActionTypes } from "../constants.js";
import Quicklook from "../models/quicklook";

export const orgPropType = PropTypes.shape({
  guid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});

export class OrgStore extends BaseStore {
  constructor() {
    super();
    this.subscribe(() => this.handleAction.bind(this));
    this.currentOrgGUID = null;
    this.isFetchingOrg = false;
    this.isFetchingAll = false;
    this.cfName = "org_users";
  }

  get loading() {
    return this.isFetchingOrg || this.isFetchingAll;
  }

  handleAction(action) {
    switch (action.type) {
      case orgActionTypes.ORG_FETCH: {
        this.isFetchingOrg = true;
        this.emitChange();
        break;
      }

      case orgActionTypes.ORGS_FETCH: {
        AppDispatcher.waitFor([LoginStore.dispatchToken]);
        this.isFetchingAll = true;
        this.emitChange();
        break;
      }

      case orgActionTypes.ORG_RECEIVED: {
        this.isFetchingOrg = false;
        this.merge("guid", action.org || {}, () => {
          // Emit change regardless because loading state is updated
          this.emitChange();
        });
        break;
      }

      case orgActionTypes.ORGS_RECEIVED: {
        this.isFetchingAll = false;
        const updates = action.orgs.map(d => {
          if (d.spaces) {
            return d;
          }

          const org = this.get(d.guid);
          return Object.assign(d, { spaces: (org && org.spaces) || [] });
        });
        this.mergeMany("guid", updates);
        break;
      }

      case orgActionTypes.ORGS_SUMMARIES_RECEIVED: {
        this.mergeMany("guid", action.orgs, changed => {
          if (changed) {
            const orgUpdates = this.updateOpenOrgs(this.currentOrgGUID);
            this.mergeMany("guid", orgUpdates, () => {});
          }
        });
        this.emitChange();
        break;
      }

      case orgActionTypes.ORG_TOGGLE_SPACE_MENU: {
        this.currentOrgGUID = action.orgGuid;
        const updates = this.updateOpenOrgs(action.orgGuid);
        this.mergeMany("guid", updates, changed => {
          if (changed) this.emitChange();
        });
        break;
      }

      case orgActionTypes.ORG_TOGGLE_QUICKLOOK: {
        const org = this.get(action.orgGuid);
        if (!org) {
          break;
        }

        const orgQuicklook = new Quicklook(org.quicklook || {});
        const toggledOrg = {
          ...org,
          quicklook: orgQuicklook.merge({ open: !orgQuicklook.open })
        };
        this.merge("guid", toggledOrg);
        break;
      }

      case orgActionTypes.ORG_TOGGLE_QUICKLOOK_SUCCESS: {
        const org = this.get(action.orgGuid);
        if (!org) {
          break;
        }

        const orgQuicklook = new Quicklook(org.quicklook);
        const toggledOrg = {
          ...org,
          quicklook: orgQuicklook.merge({ isLoaded: true, error: null })
        };
        this.merge("guid", toggledOrg);
        break;
      }

      case orgActionTypes.ORG_TOGGLE_QUICKLOOK_ERROR: {
        const org = this.get(action.orgGuid);
        if (!org) {
          break;
        }

        const orgQuicklook = org.quicklook;
        const toggledOrg = {
          ...org,
          quicklook: orgQuicklook.merge({ isLoaded: true, error: action.error })
        };
        this.merge("guid", toggledOrg);
        break;
      }

      default:
        break;
    }
  }

  currentOrg() {
    return this.get(this.currentOrgGUID);
  }

  get currentOrgGuid() {
    return this.currentOrgGUID;
  }

  get currentOrgName() {
    const org = this.get(this.currentOrgGUID);
    if (!org) return "";
    return org.name;
  }

  updateOpenOrgs(openOrgGuid) {
    const allOrgs = this.getAll();
    const updates = allOrgs.map(org => {
      if (org.guid === openOrgGuid) {
        return Object.assign({}, org, { space_menu_open: true });
      }
      return Object.assign({}, org, { space_menu_open: false });
    });
    return updates;
  }
}

const orgStore = new OrgStore();

window.orgstore = orgStore;

export default orgStore;
