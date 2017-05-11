
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

  getInviteUaaUser(email) {
    return http.post(`${URL}/invite/users`, {
      emails: [email]
    }).then(res => res.data);
  },

  sendInviteEmail(response) {
    const params = {
      invite_url: false,
      email: false
    };
    if (response.new_invites.length > 0) {
      params.email = response.new_invites[0].email;
      params.inviteUrl = response.new_invites[0].inviteLink;
      if (params.email && params.inviteUrl) {
        return http.post(`${URL}/invite/email`, params)
          .then(res => res.data);
      }
    }
    return false;
  }
};
