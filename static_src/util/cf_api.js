
import http from 'axios';

import activityActions from '../actions/activity_actions.js';
import { noticeError } from '../util/analytics.js';
import appActions from '../actions/app_actions.js';
import domainActions from '../actions/domain_actions.js';
import errorActions from '../actions/error_actions.js';
import loginActions from '../actions/login_actions.js';
import orgActions from '../actions/org_actions.js';
import quotaActions from '../actions/quota_actions.js';
import routeActions from '../actions/route_actions.js';
import spaceActions from '../actions/space_actions.js';
import serviceActions from '../actions/service_actions.js';
import userActions from '../actions/user_actions.js';

const APIV = '/v2';

function handleError(err, errHandler = errorActions.errorFetch) {
  // An http error should be passed to error actions.
  if (err.status && err.status >= 400) {
    if (err.data) {
      errHandler(err.data);
    } else {
      errHandler(err);
    }
    noticeError(err);
  // Other exceptions should be thrown so they surface.
  } else {
    throw err;
  }
}

export default {
  version: APIV,

  fetch(url, action, multiple, ...params) {
    return http.get(APIV + url).then((res) => {
      if (!multiple) {
        action(res.data, ...params);
      } else {
        action(res.data.resources, ...params);
      }
    }).catch((err) => {
      handleError(err);
    });
  },

  fetchOne(url, action, ...params) {
    return this.fetch(url, action, false, ...params);
  },

  fetchMany(url, action, ...params) {
    return this.fetch(url, action, true, ...params);
  },

  fetchAllPages(url, action, ...params) {
    return http.get(APIV + url).then((res) => {
      const urls = [];

      if (!res.data.next_url) return action(res.data.resources);

      for (let i = 2; i <= res.data.total_pages; i++) {
        urls.push(`${APIV}${url}?page=${i}`);
      }

      const reqs = urls.map((u) => http.get(u).then((r) => r.data.resources));

      return Promise.all(reqs)
        .then((all) => all.pop())
        .then((all) => [].concat.call([], res.data.resources, all))
        .then((all) => action(all, ...params))
        .catch((err) => handleError(err));
    });
  },

  getAuthStatus() {
    return http.get(`${APIV}/authstatus`).then((res) => {
      loginActions.receivedStatus(res.data.status);
    }).catch(() => {
      loginActions.receivedStatus(false);
    });
  },

  fetchOrgLinks(guid) {
    return http.get(`${APIV}/organizations/${guid}`).then((res) =>
      res.data.entity);
  },

  fetchOrgSummary(guid) {
    return this.fetchOrgDetails(guid);
  },

  fetchOrgDetails(guid) {
    return http.get(`${APIV}/organizations/${guid}/summary`)
        .then((res) => res.data);
  },

  fetchOrg(guid) {
    let fullOrg = {};
    const req = Promise.all(
      [this.fetchOrgLinks(guid), this.fetchOrgDetails(guid)]);

    return req.then((res) => {
      fullOrg = Object.assign(...res);
      return Promise.all([
        this.fetchOrgMemoryUsage(guid),
        this.fetchOrgMemoryLimit(fullOrg)
      ]);
    }).then((res) => {
      let quota = {};
      quota = Object.assign(quota, ...res);
      fullOrg.quota = quota;
      orgActions.receivedOrg(fullOrg);
    }, (err) => {
      errorActions.errorFetch(err);
    });
  },

  fetchOrgMemoryUsage(guid) {
    return http.get(`${APIV}/organizations/${guid}/memory_usage`)
      .then((res) => res.data);
  },

  fetchOrgMemoryLimit(org) {
    return http.get(org.quota_definition_url)
      .then((res) => res.data.entity);
  },

  fetchOrgs() {
    return http.get(`${APIV}/organizations`).then((res) => {
      orgActions.receivedOrgs(res.data.resources);
    }).catch((err) => {
      handleError(err);
    });
  },

  fetchOrgsSummaries(guids) {
    return Promise.all(guids.map((guid) => this.fetchOrgSummary(guid)))
    .then((res) => orgActions.receivedOrgsSummaries(res))
    .catch((err) => {
      handleError(err);
    });
  },

  fetchOrgsQuotas() {
    return this.fetchAllPages('/quota_definitions',
                              quotaActions.receivedQuotasForAllOrgs);
  },

  fetchSpacesQuotas() {
    return this.fetchAllPages('/space_quota_definitions',
                              quotaActions.receivedQuotasForAllSpaces);
  },

  fetchSpaces() {
    return http.get(`${APIV}/spaces`).then((res) => {
      spaceActions.receivedSpaces(res.data.resources);
    }).catch((err) => {
      handleError(err);
    });
  },

  fetchSpace(spaceGuid) {
    return this.fetchOne(`/spaces/${spaceGuid}/summary`,
                         spaceActions.receivedSpace);
  },

  fetchSpaceEvents(spaceGuid) {
    return this.fetchAllPages(`/spaces/${spaceGuid}/events`,
                               activityActions.receivedSpaceEvents);
  },

  fetchServiceInstance(instanceGuid) {
    return this.fetchOne(`/service_instances/${instanceGuid}`,
                          serviceActions.receivedInstance);
  },

  fetchServiceInstances(spaceGuid) {
    return this.fetchMany(`/spaces/${spaceGuid}/service_instances`,
                          serviceActions.receivedInstances);
  },

  createServiceInstance(name, spaceGuid, servicePlanGuid) {
    const payload = {
      name,
      space_guid: spaceGuid,
      service_plan_guid: servicePlanGuid
    };

    return http.post(`${APIV}/service_instances?accepts_incomplete=true`, payload)
      .then((res) => {
        serviceActions.createdInstance(res.data);
      }).catch((err) => {
        handleError(err, serviceActions.errorCreateInstance);
      });
  },

  deleteUnboundServiceInstance(serviceInstance) {
    return http.delete(serviceInstance.url)
    .then(() => {
      serviceActions.deletedInstance(serviceInstance.guid);
    }).catch(() => {
      // Do nothing.
    });
  },

  fetchAppAll(appGuid) {
    return Promise.all([
      this.fetchApp(appGuid),
      this.fetchAppStats(appGuid)
    ]).then(() => {
      appActions.receivedAppAll(appGuid);
    });
  },

  fetchApp(appGuid) {
    return this.fetchOne(`/apps/${appGuid}/summary`,
                          appActions.receivedApp);
  },

  fetchAppStats(appGuid) {
    return http.get(`${APIV}/apps/${appGuid}/stats`).then((res) => {
      appActions.receivedAppStats(appGuid, res.data[0]);
    }).catch((err) => {
      handleError(err);
    });
  },

  fetchAppLogs(appGuid) {
    return http.get(`log/recent?app=${appGuid}`).then((res) => {
      activityActions.receivedAppLogs(appGuid, res.data);
    }).catch((err) => {
      handleError(err);
    });
  },

  /**
   * Fetch all users that belong to a certain space.
   *
   * @param {Number} spaceGuid - The guid of the space that the users belong to.
   */
  fetchSpaceUsers(spaceGuid) {
    return this.fetchMany(`/spaces/${spaceGuid}/user_roles`,
                          userActions.receivedSpaceUsers,
                          spaceGuid);
  },

  /**
   * Fetch all users that belong to a certain space.
   *
   * @param {Number} orgGuid - The guid of the org that the users belong to.
   */
  fetchOrgUsers(orgGuid) {
    return this.fetchMany(`/organizations/${orgGuid}/users`,
                          userActions.receivedOrgUsers,
                          orgGuid);
  },

  fetchOrgUserRoles(orgGuid) {
    return this.fetchMany(`/organizations/${orgGuid}/user_roles`,
                          userActions.receivedOrgUserRoles,
                          orgGuid);
  },

  deleteUser(userGuid, orgGuid) {
    return http.delete(`${APIV}/organizations/${orgGuid}/users/${userGuid}`)
      .then(() => {
        userActions.deletedUser(userGuid, orgGuid);
      }).catch((err) => {
        if (err.data) {
          userActions.errorRemoveUser(userGuid, err.data);
        } else {
          handleError(err);
        }
      });
  },

  // TODO deprecate possibly in favor of deleteOrgUserPermissions.
  deleteOrgUserCategory(userGuid, orgGuid, category) {
    return http.delete(`${APIV}/organizations/${orgGuid}/${category}
      /${userGuid}`).catch(() => {
        // TODO create correct error action.
      });
  },

  deleteOrgUserPermissions(userGuid, orgGuid, permissions) {
    return http.delete(`${APIV}/organizations/${orgGuid}/${permissions}/${userGuid}`)
      .then((res) =>
        res.response
      , (err) => {
        userActions.errorRemoveUser(userGuid, err.data);
      });
  },

  putOrgUserPermissions(userGuid, orgGuid, permissions) {
    return http.put(`${APIV}/organizations/${orgGuid}/${permissions}/${userGuid}`)
      .then((res) => res.response
    );
  },

  // TODO refactor with org user permissions
  putSpaceUserPermissions(userGuid, spaceGuid, role) {
    return http.put(`${APIV}/spaces/${spaceGuid}/${role}/${userGuid}`)
      .then((res) => res.response, () => {
        // TODO figure out error action
      });
  },

  // TODO refactor with org user permissions
  deleteSpaceUserPermissions(userGuid, spaceGuid, role) {
    return http.delete(`${APIV}/spaces/${spaceGuid}/${role}/${userGuid}`)
      .then((res) => res.response, (err) => {
        userActions.errorRemoveUser(userGuid, err.data);
      });
  },

  fetchServicePlan(servicePlanGuid) {
    return this.fetchOne(`/service_plans/${servicePlanGuid}`,
                         serviceActions.receivedPlan);
  },

  fetchAllServices(orgGuid) {
    return this.fetchMany(`/organizations/${orgGuid}/services`,
      serviceActions.receivedServices);
  },

  fetchAllServicePlans(serviceGuid) {
    return this.fetchMany(`/services/${serviceGuid}/service_plans`,
      serviceActions.receivedPlans);
  },

  fetchRoutesForApp(appGuid) {
    return this.fetchMany(`/apps/${appGuid}/routes`,
      routeActions.receivedRoutesForApp,
      appGuid);
  },

  fetchRoutesForSpace() {

  },

  // http://apidocs.cloudfoundry.org/241/routes/creating_a_route.html
  createRoute(domainGuid, spaceGuid, host, path) {
    const payload = {
      domain_guid: domainGuid,
      space_guid: spaceGuid,
      host,
      path
    };
    return http.post(`${APIV}/routes`, payload).then((res) => {
      routeActions.createdRoute(res.data);
      return res.data;
    }).catch((err) => handleError(err, routeActions.errorCreateRoute));
  },

  // http://apidocs.cloudfoundry.org/241/routes/delete_a_particular_route.html
  deleteRoute(routeGuid) {
    const url = `${APIV}/routes/${routeGuid}?recursive=true`;
    return http.delete(url).then(() => {
      routeActions.deletedRoute(routeGuid);
    }).catch((err) => {
      handleError(err, routeActions.error.bind(this, routeGuid));
    });
  },

  // http://apidocs.cloudfoundry.org/241/apps/associate_route_with_the_app.html
  putAppRouteAssociation(appGuid, routeGuid) {
    const url = `${APIV}/routes/${routeGuid}/apps/${appGuid}`;
    return http.put(url).then(() => {
      routeActions.associatedApp(routeGuid, appGuid);
    }).catch((err) => {
      handleError(err, routeActions.error.bind(this, routeGuid));
    });
  },

  deleteAppRouteAssociation(appGuid, routeGuid) {
    const url = `${APIV}/apps/${appGuid}/routes/${routeGuid}`;
    return http.delete(url).then(() => {
      routeActions.unassociatedApp(routeGuid, appGuid);
    }).catch((err) => {
      handleError(err, routeActions.error.bind(this, routeGuid));
    });
  },

  // http://apidocs.cloudfoundry.org/241/routes/update_a_route.html
  putRouteUpdate(routeGuid, domainGuid, spaceGuid, route) {
    const url = `${APIV}/routes/${routeGuid}`;
    const payload = {
      domain_guid: domainGuid,
      space_guid: spaceGuid,
      host: route.host,
      path: route.path
    };
    return http.put(url, payload).then(() => {
      routeActions.updatedRoute(routeGuid, route);
    }).catch((err) => {
      handleError(err, routeActions.error.bind(this, routeGuid));
    });
  },

  fetchPrivateDomain(domainGuid) {
    return this.fetchOne(`/private_domains/${domainGuid}`,
      domainActions.receivedDomain);
  },

  fetchSharedDomain(domainGuid) {
    return this.fetchOne(`/shared_domains/${domainGuid}`,
      domainActions.receivedDomain);
  },

  fetchServiceBindings(appGuid) {
    if (!appGuid) {
      return this.fetchMany('/service_bindings',
        serviceActions.receivedServiceBindings);
    }
    return this.fetchMany(`/apps/${appGuid}/service_bindings`,
                         serviceActions.receivedServiceBindings);
  },

  createServiceBinding(appGuid, serviceInstanceGuid) {
    const payload = {
      app_guid: appGuid,
      service_instance_guid: serviceInstanceGuid
    };
    return http.post(`${APIV}/service_bindings`, payload).then((res) => {
      serviceActions.boundService(res.data);
    }).catch((err) => {
      handleError(err, errorActions.errorPost);
    });
  },

  deleteServiceBinding(serviceBinding) {
    return http.delete(`${APIV}/service_bindings/${serviceBinding.guid}`).then(
    () => {
      serviceActions.unboundService(serviceBinding);
    }).catch((err) => {
      handleError(err, errorActions.errorDelete);
    });
  }
};
