
import http from 'axios';

import errorActions from '../actions/error_actions.js';
import loginActions from '../actions/login_actions.js';
import loginActionTypes from '../constants.js';
import orgActions from '../actions/org_actions.js';

const APIV = '/v2';

export default {
  getAuthStatus() {
    return http.get(APIV + '/authstatus').then((res) => {
      loginActions.receivedStatus(res.data.status);
    }, (err) => {
      loginActions.receivedStatus(false);
    });
  },

  fetchOrg(guid) {
    return http.get(APIV + '/organizations/' + guid + '/summary').then((res) => {
      orgActions.receivedOrg(res.data);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchOrgMemoryUsage(guid) {
    return http.get(APIV + '/organizations/' + guid + '/memory_usage');
  },

  fetchOrgMemoryLimit(guid) {
    return http.get(APIV + '/quota_definitions/' + guid);
  },

  fetchOrgs() {
    return http.get(APIV + '/organizations').then((res) => {
      orgActions.receivedOrgs(res.data.resources);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  }
};
