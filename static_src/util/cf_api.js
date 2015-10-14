
import http from 'axios';

import errorActions from '../actions/error_actions.js';
import loginActions from '../actions/login_actions.js';
import loginActionTypes from '../constants.js';
import orgActions from '../actions/org_actions.js';
import spaceActions from '../actions/space_actions.js';

const APIV = '/v2';

export default {
  getAuthStatus() {
    return http.get(APIV + '/authstatus').then((res) => {
      loginActions.receivedStatus(res.data.status);
    }, (err) => {
      loginActions.receivedStatus(false);
    });
  },

  fetchOrgLinks(guid) {
    return http.get(APIV + '/organizations/' + guid).then((res) => {
      return res.data.entity;
    });
  },

  fetchOrgDetails(guid) {
    return http.get(APIV + '/organizations/' + guid + '/summary')
        .then((res) => {
      return res.data;
    });
  },

  fetchOrg(guid) {
    var fullOrg = {};
    var req = Promise.all([this.fetchOrgLinks(guid), this.fetchOrgDetails(guid)]);

    return req.then((res) => {
      fullOrg = Object.assign(...res);
      return Promise.all([
        this.fetchOrgMemoryUsage(guid),
        this.fetchOrgMemoryLimit(fullOrg)
      ]); 
    }).then((res) => {
      var quota = {}
      quota = Object.assign(quota, ...res);
      fullOrg.quota = quota;
      orgActions.receivedOrg(fullOrg);
    }, (err) => {
      errorActions.errorFetch(err); 
    });
  },

  fetchOrgMemoryUsage(guid) {
    return http.get(APIV + '/organizations/' + guid + '/memory_usage')
    .then((res) => {
      return res.data; 
    });;
  },

  fetchOrgMemoryLimit(org) {
    return http.get(org.quota_definition_url)
    .then((res) => {
      return res.data.entity; 
    });;
  },

  fetchOrgs() {
    return http.get(APIV + '/organizations').then((res) => {
      orgActions.receivedOrgs(res.data.resources);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchSpace(guid) {
    return http.get(APIV + '/spaces/' + guid + '/sumary').then((res) => {
      spaceActions.receivedSpace(res.data);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  }
};
