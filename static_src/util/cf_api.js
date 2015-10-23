
import http from 'axios';

import appActions from '../actions/app_actions.js';
import errorActions from '../actions/error_actions.js';
import loginActions from '../actions/login_actions.js';
import loginActionTypes from '../constants.js';
import orgActions from '../actions/org_actions.js';
import spaceActions from '../actions/space_actions.js';
import serviceActions from '../actions/service_actions.js';
import userActions from '../actions/user_actions.js';

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

  fetchSpace(spaceGuid) {
    return http.get(
      APIV + `/spaces/${spaceGuid}/summary`)
        .then((res) => {
      spaceActions.receivedSpace(res.data);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchServiceInstances(spaceGuid) {
    return http.get(APIV + `/spaces/${ spaceGuid }/service_instances`).then(
        (res) => {
      serviceActions.receivedInstances(res.data.resources);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  deleteUnboundServiceInstance(serviceInstance) {
    return http.delete(APIV + 
        `/service_instances/${ serviceInstance.url }`)
    .then((res) => {
      serviceActions.deletedInstance(serviceInstance.guid);
    }, (err) => {
      // Do nothing.
    });
  },

  fetchApp(appGuid) {
    return http.get(APIV + `/apps/${ appGuid }/summary`).then((res) => {
      appActions.receivedApp(res.data);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchSpaceUsers(spaceGuid) {
    return http.get(APIV + `/spaces/${ spaceGuid }/user_roles`).then((res) => {
      userActions.receivedUsers(res.data.resources);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchOrgUsers(orgGuid) {
    return http.get(APIV + `/organizations/${ orgGuid }/users`).then((res) => {
      userActions.receivedUsers(res.data.resources);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  }
};
