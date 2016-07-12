
import http from 'axios';
import errorActions from '../actions/error_actions.js';
import userActions from '../actions/user_actions.js';

const URL = '/uaa';

export default {
  fetchUserInfo() {
    return http.get(`${URL}/userinfo`).then((res) => {
      userActions.receivedCurrentUserInfo(res.data);
    }).catch((err) => {
      errorActions.errorFetch(err);
    });
  }
};
