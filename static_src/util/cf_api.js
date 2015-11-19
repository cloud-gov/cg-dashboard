
import http from 'axios';
import 'promises-done-polyfill';

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
    return http.get(APIV + '/authstatus').done((res) => {
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
    return http.get(APIV + '/organizations').done((res) => {
      orgActions.receivedOrgs(res.data.resources);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchSpace(spaceGuid) {
    return http.get(
      APIV + `/spaces/${spaceGuid}/summary`)
        .done((res) => {
      spaceActions.receivedSpace(res.data);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchServiceInstances(spaceGuid) {
    return http.get(APIV + `/spaces/${ spaceGuid }/service_instances`).done(
        (res) => {
      serviceActions.receivedInstances(res.data.resources);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  deleteUnboundServiceInstance(serviceInstance) {
    return http.delete(APIV + 
        `/service_instances/${ serviceInstance.url }`)
    .done((res) => {
      serviceActions.deletedInstance(serviceInstance.guid);
    }, (err) => {
      // Do nothing.
    });
  },

  fetchApp(appGuid) {
    return http.get(APIV + `/apps/${ appGuid }/summary`).done((res) => {
      appActions.receivedApp(res.data);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  /**
   * Fetch all users that belong to a certain space.
   *
   * @param {Number} spaceGuid - The guid of the space that the users belong to.
   */
  fetchSpaceUsers(spaceGuid) {
    return http.get(APIV + `/spaces/${ spaceGuid }/user_roles`).done((res) => {
      userActions.receivedSpaceUsers(res.data.resources, spaceGuid);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  /**
   * Fetch all users that belong to a certain space.
   *
   * @param {Number} orgGuid - The guid of the org that the users belong to.
   */
  fetchOrgUsers(orgGuid) {
    return http.get(APIV + `/organizations/${ orgGuid }/users`).done((res) => {
      userActions.receivedOrgUsers(res.data.resources, orgGuid);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  deleteUser(userGuid, orgGuid) {
    return http.delete(APIV + '/organizations/' + orgGuid + '/users/' + userGuid)
        .done((res) => {
      userActions.deletedUser(userGuid, orgGuid);
    }, (err) => {
      userActions.errorRemoveUser(userGuid, err.data);
    });
  },

  // TODO deprecate possibly in favor of deleteOrgUserPermissions.
  deleteOrgUserCategory(userGuid, orgGuid, category) {
    return http.delete(APIV + '/organizations/' + orgGuid + '/' + category +
                       '/' + userGuid).catch((err) => {
      // TODO create correct error action.
    });
  },

  deleteOrgUserPermissions(userGuid, orgGuid, permissions) {
    return http.delete(APIV + '/organizations/' + orgGuid + '/' + permissions + 
                       '/' + userGuid).then((res) => {
      return res.response; 
    }, (err) => {
      userActions.errorRemoveUser(userGuid, err.data);
    });
  },

  putOrgUserPermissions(userGuid, orgGuid, permissions) {
    return http.put(APIV + '/organizations/' + orgGuid + '/' + permissions + 
                       '/' + userGuid).then((res) => {
      return res.response; 
    });
  },

  fetchAllServices(orgGuid) {
    return http.get(APIV + '/organizations/' + orgGuid + '/services').done(
    (res) => {
      serviceActions.receivedServices(res.data.resources);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchAllServicePlans(serviceGuid) {
    return http.get(APIV + '/services/' + serviceGuid + '/service_plans').done(
    (res) => {
      serviceActions.receivedPlans(res.data.resources);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  }

};
