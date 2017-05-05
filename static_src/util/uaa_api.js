
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
    var self = this;
    return http.post(`${URL}/invite/users`, {
      emails: [email]
    })
      .then(function (res){
        self.initiateInviteEmail(res.data);
        return res.data;
      });
  },

  // Example response:
  // {
  //  "new_invites": [
  //    {
  //      "email":"example11@domkain.com",
  //      "userId":"959f1c8e-e615-4a73-80a6-ce6751c00719",
  //      "origin":"uaa",
  //      "success":true,
  //      "errorCode":null,
  //      "errorMessage":null,
  //      "inviteLink":"https://uaa.fr.cloud.gov/invitations/accept?code=dd8ef6b5"
  //    }
  //  ],
  //  "failed_invites":[]
  // }
  initiateInviteEmail(response) {
    if (response['new_invites'].length > 0){
      let email, invite_url;
      email = response['new_invites'][0]['email']
      invite_url = response['new_invites'][0]['inviteLink']
      if (email && invite_url){
        return http.get(`${URL}/invite/email?email=${email}&invite_url=${invite_url}`, {
          emails: [email]
        })
          .then(res => res.data);
      }
    }
    return false;
  }
};
