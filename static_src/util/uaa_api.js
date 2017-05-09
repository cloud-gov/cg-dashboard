
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
    if (response['new_invites'].length > 0){
      let email, invite_url;
      email = response['new_invites'][0]['email']
      invite_url = response['new_invites'][0]['inviteLink']
      if (email && invite_url){
        return http.post(`${URL}/invite/email?email=${email}&invite_url=${invite_url}`, {
          emails: [email]
        })
          .then(res => res.data);
      }
    }
    return false;
  }
};
