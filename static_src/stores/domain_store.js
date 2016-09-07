
/*
 * Store for domain data. Will store and update domain data on changes from UI and
 * server.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { domainActionTypes } from '../constants.js';

class DomainStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {
      case domainActionTypes.DOMAIN_FETCH: {
        cfApi.fetchPrivateDomain(action.domainGuid);
        break;
      }

      case domainActionTypes.DOMAIN_RECEIVED: {
        const formattedDomain = this.formatSplitResponse([action.domain])[0];

        this.merge('guid', formattedDomain, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      default:
        break;
    }
  }
}

const _DomainStore = new DomainStore();

export default _DomainStore;
