import http from "axios";

const URL = "/uaa";

export default {
  fetchUserInfo() {
    return http.get(`${URL}/userinfo`).then(res => res.data);
  },

  fetchUaaInfo(guid) {
    return http.get(`${URL}/uaainfo?uaa_guid=${guid}`).then(res => res.data);
  },

  inviteUaaUser(email) {
    const params = {};
    params.email = email;
    return http
      .post(`${URL}/invite/users`, params)
      .then(res => res.data)
      .catch(err => Promise.reject(err.response.data));
  },

  sendInviteEmail(response) {
    const params = {};
    if (response.new_invites.length > 0) {
      params.email = response.new_invites[0].email;
      params.inviteUrl = response.new_invites[0].inviteLink;
      params.inviteUrl = response.new_invites[0].inviteLink;
      if (params.email && params.inviteUrl) {
        return http.post(`${URL}/invite/email`, params).then(res => res.data);
      }
    }
    return false;
  }
};
