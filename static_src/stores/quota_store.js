
/*
 * Store for quota data.
 */

import Immutable from 'immutable';

import BaseStore from './base_store.js';
import cfApi from '../util/cf_api.js';
import { quotaActionTypes } from '../constants.js';

class QuotaStore extends BaseStore {
  constructor() {
    super();
    this._data = new Immutable.List();
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch (action.type) {

      case quotaActionTypes.ORGS_QUOTAS_FETCH: {
        this.load([cfApi.fetchOrgsQuotas()]);
        this.emitChange();
        break;
      }

      case quotaActionTypes.ORGS_QUOTAS_RECEIVED: {
        const quotas = action.quotas;
        this.mergeMany('guid', quotas, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      case quotaActionTypes.SPACES_QUOTAS_FETCH: {
        this.load([cfApi.fetchOrgsQuotas()]);
        this.emitChange();
        break;
      }

      case quotaActionTypes.SPACES_QUOTAS_RECEIVED: {
        const quotas = action.quotas;
        this.mergeMany('guid', quotas, (changed) => {
          if (changed) this.emitChange();
        });
        break;
      }

      default:
        break;
    }
  }
}

const _QuotaStore = new QuotaStore();

export default _QuotaStore;
