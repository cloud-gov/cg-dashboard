import http from 'axios';

import { noticeError } from '../util/analytics.js';
import domainActions from '../actions/domain_actions.js';
import errorActions from '../actions/error_actions.js';
import quotaActions from '../actions/quota_actions.js';
import routeActions from '../actions/route_actions.js';
import userActions from '../actions/user_actions.js';

const APIV = '/v2';

// TODO handleError should probably return a (rejected) Promise
function handleError(err, errHandler = errorActions.errorFetch) {
  // An http error should be passed to error actions.
  // When an error has a `reponse` object, it's likely from ajax.
  if (err.response) {
    const errRes = err.response;
    if (errRes.data) {
      errHandler(errRes.data);
    } else {
      errHandler(errRes);
    }
    noticeError(err);
    throw err;
    // Other exceptions should be thrown so they surface.
  } else {
    throw err;
  }
}

// Some general error handling for API calls
// Logs the error, reports to NR, and rejects the error so error actions can
// handle them appropriately.
function promiseHandleError(err) {
  console.warn('cf_api error', { err }); // eslint-disable-line no-console
  noticeError(err);
  return Promise.reject(err);
}

// Some fields are serialized JSON that need parsing
export function tryParseJson(serialized) {
  if (!serialized) {
    return Promise.resolve(null);
  }

  let parsed;
  try {
    parsed = JSON.parse(serialized);
  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.resolve(parsed);
}

export default {
  version: APIV,

  formatSplitResponse(resource) {
    return Object.assign({}, resource.entity, resource.metadata);
  },

  formatSplitResponses(resources) {
    return resources.map((r) => this.formatSplitResponse(r));
  },

  fetch(url, _action, multiple, ...params) {
    // Set a default noop action handler
    const action = typeof _action === 'function' ? _action : () => {};
    return http.get(APIV + url).then((res) => {
      let data;
      if (!multiple) {
        data = res.data;
        if (!/summary/.test(url)) {
          data = this.formatSplitResponse(data);
        }
        action(data, ...params);
      } else {
        data = res.data.resources;
        if (!/summary/.test(url)) {
          data = this.formatSplitResponses(data);
        }
        action(data, ...params);
      }
      return data;
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

  // fetchAllPages(url, data = {}, action = () => {})
  fetchAllPages(url, ...args) {
    let [data, action] = args;
    if (typeof data === 'function') {
      action = data;
      data = {};
    }

    const path = `${APIV}${url}`;
    return http.get(path, { params: data }).then((res) => {
      const pages = [];

      if (!res.data.next_url) {
        return action(this.formatSplitResponses(res.data.resources));
      }

      for (let i = 2; i <= res.data.total_pages; i++) {
        pages.push(
          http.get(path, { params: Object.assign({}, data, { page: i }) })
            .then(page => page.data.resources)
        );
      }

      return Promise.all(pages)
        .then((all) => Array.prototype.concat.apply([], all))
        .then((all) => res.data.resources.concat(all))
        .then((all) => action(this.formatSplitResponses(all)))
        .catch((err) => {
          handleError(err);
          return Promise.reject(err);
        });
    });
  },

  getAuthStatus() {
    return http.get(`${APIV}/authstatus`)
      .then(res => res.data.status)
      // Note: the getAuthStatus call will return 401 when not logged in, so
      // failure here means the user was likely not logged in. Although there
      // could be the additional problem that there was a problem with the req.
      .catch(() => false);
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
    return Promise.all([
      this.fetchOrgLinks(guid),
      this.fetchOrgDetails(guid),
      this.fetchOrgMemoryUsage(guid)
    ])
    .then(([org, orgDetails, quota]) => Object.assign({}, org, orgDetails, { quota }))
    .then(org =>
      this.fetchOrgMemoryLimit(org)
        .then(limit => {
          const quota = Object.assign({}, org.quota, limit);
          return Object.assign({}, org, { quota });
        })
    )
    .catch(errorActions.errorFetch);
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
    return http.get(`${APIV}/organizations`)
      .then(res => this.formatSplitResponses(res.data.resources))
      .catch(err => {
        handleError(err);
        return Promise.reject(err);
      });
  },

  fetchOrgsQuotas() {
    return this.fetchAllPages('/quota_definitions', quotaActions.receivedQuotasForAllOrgs)
      .catch(() => {}); // TODO handle error with error action
  },

  fetchSpacesQuotas() {
    return this.fetchAllPages('/space_quota_definitions', quotaActions.receivedQuotasForAllSpaces)
      .catch(() => {}); // TODO handle error with error action
  },

  fetchSpaces() {
    return this.fetchAllPages('/spaces', (results) => Promise.resolve(results));
  },

  fetchSpace(spaceGuid) {
    return this.fetchOne(`/spaces/${spaceGuid}/summary`);
  },

  fetchSpaceEvents(spaceGuid, options) {
    const { appGuid } = options || {};

    const data = {};
    if (appGuid) {
      data.q = `actee:${appGuid}`;
    }

    return this.fetchAllPages(`/spaces/${spaceGuid}/events`, data, results => results);
  },

  fetchServiceInstance(instanceGuid) {
    return this.fetchOne(`/service_instances/${instanceGuid}`);
  },

  fetchServiceInstances(spaceGuid) {
    return this.fetchMany(`/spaces/${spaceGuid}/service_instances`);
  },

  createServiceInstance(name, spaceGuid, servicePlanGuid) {
    const payload = {
      name,
      space_guid: spaceGuid,
      service_plan_guid: servicePlanGuid
    };

    return http.post(`${APIV}/service_instances?accepts_incomplete=true`, payload)
      .then((res) => this.formatSplitResponse(res.data))
      .catch((err) => {
        handleError(err);
        return Promise.reject(err);
      });
  },

  deleteUnboundServiceInstance(serviceInstance) {
    return http.delete(serviceInstance.url);
  },

  fetchAppAll(appGuid) {
    return Promise.all([
      this.fetchApp(appGuid),
      this.fetchAppStats(appGuid)
    ]);
  },

  fetchApp(appGuid) {
    return this.fetchOne(`/apps/${appGuid}/summary`);
  },

  fetchAppStatus(appGuid) {
    return http.get(`${APIV}/apps/${appGuid}/summary`).then((res) => res.data);
  },

  fetchAppStats(appGuid) {
    return http.get(`${APIV}/apps/${appGuid}/stats`)
      .then(res => {
        // Helper variable is here to avoid block statement getting confused
        // with object literal
        const app = { app_instances: Object.values(res.data) };
        return app;
      }).catch(handleError);
  },

  fetchAppLogs(appGuid) {
    return http.get(`log/recent?app=${appGuid}`)
      .then(res => res.data)
      .catch(promiseHandleError);
  },

  putApp(appGuid, app) {
    return http.put(`${APIV}/apps/${appGuid}`, app)
      .then((res) => Object.assign({}, res.data.entity, { guid: appGuid }))
      .catch(err => handleError(err, e => Promise.reject(e)));
  },

  postAppRestart(appGuid) {
    return http.post(`${APIV}/apps/${appGuid}/restage`)
      .then(() => appGuid)
      .catch(err => handleError(err, e => Promise.reject(e)));
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
        if (err.response.data) {
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
    return this.fetchOne(`/service_plans/${servicePlanGuid}`)
      .then(servicePlan =>
        // Service plans have an `extra` field of metadata
        tryParseJson(servicePlan.extra)
          .then(extra => ({ ...servicePlan, extra }))
          .catch(err => {
            const e = new Error('Failed to parse service plan extra data');
            e.parseError = err;
            return Promise.reject(e);
          })
      );
  },

  fetchAllServices(orgGuid) {
    return this.fetchMany(`/organizations/${orgGuid}/services`);
  },

  fetchAllServicePlans(serviceGuid) {
    return this.fetchMany(`/services/${serviceGuid}/service_plans`)
      .then(servicePlans =>
        Promise.all(servicePlans.map(servicePlan =>
          // Service plans have an `extra` field of metadata
          tryParseJson(servicePlan.extra)
            .then(extra => ({ ...servicePlan, extra }))
            .catch(err => {
              const e = new Error(`Failed to parse service plan '${servicePlan.guid}' extra data`);
              e.parseError = err;
              return Promise.reject(e);
            })
        ))
      );
  },

  fetchRoutesForApp(appGuid) {
    return this.fetchMany(`/apps/${appGuid}/routes`,
      routeActions.receivedRoutesForApp,
      appGuid);
  },

  fetchRoutesForSpace(spaceGuid) {
    return this.fetchMany(`/spaces/${spaceGuid}/routes`,
      routeActions.receivedRoutes,
      spaceGuid);
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
      routeActions.createdRoute(this.formatSplitResponse(res.data));
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
      return this.fetchMany('/service_bindings');
    }

    return this.fetchMany(`/apps/${appGuid}/service_bindings`);
  },

  createServiceBinding(appGuid, serviceInstanceGuid) {
    const payload = {
      app_guid: appGuid,
      service_instance_guid: serviceInstanceGuid
    };
    return http.post(`${APIV}/service_bindings`, payload)
      .then(res => this.formatSplitResponse(res.data))
      .catch(err => {
        handleError(err);
        return Promise.reject(err);
      });
  },

  deleteServiceBinding(serviceBinding) {
    return http.delete(`${APIV}/service_bindings/${serviceBinding.guid}`)
      .catch(err => {
        handleError(err);
        return Promise.reject(err);
      });
  },

  fetchUser(userGuid) {
    return this.fetchOne(`/users/${userGuid}`);
  },

  fetchUserSpaces(userGuid, options = {}) {
    const data = {};
    if (options.orgGuid) {
      data.q = `organization_guid:${options.orgGuid}`;
    }

    return this.fetchAllPages(`/users/${userGuid}/spaces`, data, results => results);
  }
};
