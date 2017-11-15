/*
 * Store for domain data. Will store and update domain data on changes from UI and
 * server.
 */

import Immutable from "immutable";

import BaseStore from "./base_store.js";
import cfApi from "../util/cf_api.js";
import { domainActionTypes } from "../constants.js";

class DomainStore extends BaseStore {
  constructor() {
    super();
    this.storeData = new Immutable.List();
    this.subscribe(() => this.handleAction.bind(this));
  }

  handleAction(action) {
    switch (action.type) {
      case domainActionTypes.DOMAIN_FETCH: {
        cfApi.fetchPrivateDomain(action.domainGuid);
        break;
      }

      case domainActionTypes.DOMAIN_RECEIVED: {
        this.merge("guid", action.domain, changed => {
          if (changed) this.emitChange();
        });
        break;
      }

      default:
        break;
    }
  }
}

export default new DomainStore();
