
import http from 'axios';

const URL = '/uaa';

export default {
  fetchUserInfo() {
    return http.get(`${URL}/userinfo`)
      .then(res => res.data);
  },

  fetchUaaInfo(guid) {
    return http.get(`${URL}/uaainfo?uaa_guid=${guid}`)
      .then(res => res.data);
  },

  inviteUaaUser(email) {
    return http.post(`${URL}/invite_users`, {
      emails: [email]
    })
      .then(res => res.data);
  }
};
