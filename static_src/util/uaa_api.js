
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
    return http.post(`${URL}/invite/users/create`, {
      emails: [email]
    })
      .then(res => res.data);
  }
};
