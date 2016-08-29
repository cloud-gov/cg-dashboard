
/*
 * Actions for route entities. Any actions such as fetching, creating, updating,
 * etc should go here.
 */

import AppDispatcher from '../dispatcher.js';
import { quotaActionTypes } from '../constants';

export default {
  fetchAll() {
    this.fetchQuotasForAllOrgs();
    this.fetchQuotasForAllSpaces();
  },

  fetchQuotasForAllOrgs() {
    AppDispatcher.handleViewAction({
      type: quotaActionTypes.ORGS_QUOTAS_FETCH
    });
  },

  receivedQuotasForAllOrgs(quotas) {
    AppDispatcher.handleServerAction({
      type: quotaActionTypes.ORGS_QUOTAS_RECEIVED,
      quotas
    });
  },

  fetchQuotasForAllSpaces() {
    AppDispatcher.handleViewAction({
      type: quotaActionTypes.SPACES_QUOTAS_FETCH
    });
  },

  receivedQuotasForAllSpaces(quotas) {
    AppDispatcher.handleServerAction({
      type: quotaActionTypes.SPACES_QUOTAS_RECEIVED,
      quotas
    });
  }
};
