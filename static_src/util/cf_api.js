
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
  version: APIV,

  fetch(url, action, multiple) {
    return http.get(APIV + url).done((res) => {
      if (!multiple) {
        action(res.data)
      } else {
        action(res.data.resources);
      }
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchOne(url, action) {
    return this.fetch(url, action);
  },

  fetchMany(url, action) {
    return this.fetch(url, action, true);
  },

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
    return this.fetchOne(`spaces/${ spaceGuid }/summary`,
                         spaceActions.receivedSpace);
  },

  fetchServiceInstances(spaceGuid) {
    return this.fetchMany(`/spaces/${ spaceGuid }/service_instances`,
                          serviceActions.receivedInstances);
  },

  createServiceInstance(name, spaceGuid, servicePlanGuid) {
    var payload = {
      name: name,
      space_guid: spaceGuid,
      service_plan_guid: servicePlanGuid
    };

    return http.post(APIV + '/service_instances?accepts_incomplete=true', payload)
    .done((res) => {
      serviceActions.createdInstance(res.data);
    }, (err) => {
      serviceActions.errorCreateInstance(err.data);
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
    return this.fetchOne(`/apps/${ appGuid }/summary`,
                          appActions.receivedApp);
  },

  /**
   * Fetch all users that belong to a certain space.
   *
   * @param {Number} spaceGuid - The guid of the space that the users belong to.
   */
  fetchSpaceUsers(spaceGuid) {
    return this.fetchMany(`/spaces/${ spaceGuid }/user_roles`,
                          userActions.receivedSpaceUsers);
  },

  /**
   * Fetch all users that belong to a certain space.
   *
   * @param {Number} orgGuid - The guid of the org that the users belong to.
   */
  fetchOrgUsers(orgGuid) {
    return this.fetchMany(`/organizations/${ orgGuid }/users`,
                          userActions.receivedOrgUsers);
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
    return this.fetchMany('/organizations/' + orgGuid + '/services',
                          serviceActions.receivedServices);
  },

  fetchAllServicePlans(serviceGuid) {
    return this.fetchMany('/services/' + serviceGuid + '/service_plans',
                          serviceActions.receivedPlans);
  }

};
