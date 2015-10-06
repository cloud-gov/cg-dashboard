
import http from 'axios';

import loginActions from '../actions/login_actions.js';
import loginActionTypes from '../constants.js';

const APIV = '/v2';

export default {
  getAuthStatus() {
    return http.get(APIV + '/authstatus').then((res) => {
      loginActions.receivedStatus(res.data.status);
    }, (err) => {
      loginActions.receivedStatus(false);
    });
  }
};
