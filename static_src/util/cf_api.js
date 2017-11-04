import http from 'axios';
import queryString from 'query-string';

import { noticeError } from '../util/analytics.js';
import domainActions from '../actions/domain_actions.js';
import errorActions from '../actions/error_actions.js';
import quotaActions from '../actions/quota_actions.js';
import routeActions from '../actions/route_actions.js';

const APIV = '/v2';

// An error from the CF v2 API
function CfApiV2Error(response) {
  const { code, title, description } = response && response.data || {};

  if (!code || !title || !description) {
    throw new Error('CfApiV2Error expected to have code, title, and description.');
  }

  this.code = code;
  this.description = description;
  this.response = response;
  this.title = title;

  this.message = description;
}

// Babel doesn't like extending native types with `class`, so use prototype
// inheritence.
CfApiV2Error.prototype = Object.create(Error.prototype);
CfApiV2Error.prototype.constructor = Error;


// TODO handleError should probably return a (rejected) Promise
function handleError(err, errHandler = errorActions.errorFetch) {
  // An http error should be passed to error actions.
  // When an error has a `response` object, it's likely from ajax.
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

function parseError(resultOrError) {
  if (resultOrError instanceof Error) {
    // Leave it alone
    return resultOrError;
  }

  if (resultOrError.response) {
    // The request was successful but the server returned some kind of error.
    const response = resultOrError.response;
    if (response.data && typeof response.data === 'object') {
      if (response.data.description) {
        // V2 api
        const error = new CfApiV2Error(response.data);
        error.response = response;
        return error;
      }
    }

    // If data is not an object, we're not sure what to do with it.
    const error = new Error(`The API returned an unkown error with status ${response.status}.`);
    error.response = response;
    error.data = response.data;
    return error;
  }

  const error = new Error('The API returned an unkown error.');
  error.result = resultOrError;
  return error;
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

export const encodeFilter = ({ filter, op, value }) =>
  [filter, op === 'IN' ? ` ${op} ` : op, value].join('');

export const encodeFilters = (filters = []) => filters.map(encodeFilter);

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
      .then(res => res.data) // Data looks something like { status: 'authorized' }
      .catch(res => {
        if (res && res.response && res.response.status === 401) {
          // The user is unauthenicated.
          return Promise.resolve({ status: 'unauthorized' });
        }

        // At this point we're not sure if the user is auth'd or not. Treat it
        // as an error condition.
        const err = parseError(res);

        // Let someone else handle the error
        return Promise.reject(err);
      });
  },

  fetchOrgLinks(guid) {
    return http.get(`${APIV}/organizations/${guid}`).then((res) =>
      res.data.entity);
  },

  fetchOrgSummary(guid) {
    return this.fetchOrgDetails(guid);
  },

  fetchAllOrgSpaces(guid) {
    return http.get(`${APIV}/organizations/${guid}/spaces`)
        .then((res) => res.data);
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
    return this.fetchAllPages('/organizations',
      results => Promise.resolve(results))
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
      .catch((error) => Promise.reject(error));
  },

  deleteUnboundServiceInstance(serviceInstance) {
    return http.delete(serviceInstance.url);
  },

  fetchAllUPSI(params = {}) {
    const q = encodeFilters(params.q || []);

    return this.fetchMany(
      `/user_provided_service_instances?${queryString.stringify({
        ...params,
        q
      })}`
    );
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
   * @param {String} spaceGuid - The guid of the space that the users belong to.
   */
  fetchSpaceUserRoles(spaceGuid) {
    return this.fetchAllPages(`/spaces/${spaceGuid}/user_roles`,
      results => Promise.resolve(results));
  },

  /**
   * Fetch all users that belong to a certain space.
   *
   * @param {String} orgGuid - The guid of the org that the users belong to.
   */
  fetchOrgUsers(orgGuid) {
    return this.fetchAllPages(`/organizations/${orgGuid}/users`,
      results => Promise.resolve(results));
  },

  fetchOrgUserRoles(orgGuid) {
    return this.fetchAllPages(`/organizations/${orgGuid}/user_roles`,
      results => Promise.resolve(results));
  },

  deleteUser(userGuid, orgGuid) {
    return http.delete(`${APIV}/organizations/${orgGuid}/users/${userGuid}?recursive=true`)
    .then((res) => res.response);
    // TODO. should log catch if unable to parseError.
  },

  // TODO deprecate possibly in favor of deleteOrgUserPermissions.
  deleteOrgUserCategory(userGuid, orgGuid, category) {
    return http.delete(`${APIV}/organizations/${orgGuid}/${category}
      /${userGuid}`);
  },

  deleteOrgUserPermissions(userGuid, orgGuid, apiKey) {
    return http.delete(`${APIV}/organizations/${orgGuid}/${apiKey}/${userGuid}`)
      .then((res) => res.response
    );
  },

  putOrgUserPermissions(userGuid, orgGuid, permissions) {
    return http.put(`${APIV}/organizations/${orgGuid}/${permissions}/${userGuid}`)
      .then((res) => res.response
    );
  },

  putSpaceUserPermissions(userGuid, spaceGuid, role) {
    return http.put(`${APIV}/spaces/${spaceGuid}/${role}/${userGuid}`)
      .then((res) => res.response
    );
  },

  postCreateNewUserWithGuid(userGuid) {
    return http.post(`${APIV}/users`, {
      guid: userGuid
    })
      .then(res => this.formatSplitResponse(res.data))
      .catch(res => {
        if (res && res.response && res.response.status === 400) {
          if (res.response.data.error_code === 'CF-UaaIdTaken') {
            return Promise.resolve({ guid: userGuid });
          }
        }
        const err = parseError(res);
        return Promise.reject(err);
      });
  },

  putAssociateUserToOrganization(userGuid, orgGuid) {
    return http.put(`${APIV}/organizations/${orgGuid}/users/${userGuid}`)
      .then((res) => this.formatSplitResponse(res.data));
  },

  putAssociateUserToSpace(userGuid, orgGuid, spaceGuid) {
    return this.putAssociateUserToOrganization(userGuid, orgGuid)
      .then(() => http.put(`${APIV}/spaces/${spaceGuid}/auditors/${userGuid}`))
      .then((res) => this.formatSplitResponse(res.data));
  },

  deleteSpaceUserPermissions(userGuid, spaceGuid, apiKey) {
    return http.delete(`${APIV}/spaces/${spaceGuid}/${apiKey}/${userGuid}`)
      .then((res) => res.response
    );
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

  fetchEnv(appGuid) {
    return http.get(`${APIV}/apps/${appGuid}/env`);
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
      .catch(err => Promise.reject(err));
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
  },

  fetchUserOrgs(userGuid) {
    return this.fetchAllPages(`/users/${userGuid}/organizations`,
      (results) => Promise.resolve(results));
  }
};
