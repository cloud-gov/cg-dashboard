
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
    if (response.new_invites.length > 0) {
      const email = response.new_invites[0].email;
      const inviteUrl = response.new_invites[0].inviteLink;
      if (email && inviteUrl) {
        return http.post(`${URL}/invite/email`, {
          email: email,
          invite_url: inviteUrl
        })
          .then(res => res.data);
      }
    }
    return false;
  }
};
