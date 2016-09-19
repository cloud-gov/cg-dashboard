
import keymirror from 'keymirror';


// All global error action types
const errorActionTypes = keymirror({
  FETCH: null
});

const loginActionTypes = keymirror({
  // Action of fetching a login status, whether the user is logged in or not.
  FETCH_STATUS: null,
  // Action when the login status is received from the server.
  RECEIVED_STATUS: null
});

const quotaActionTypes = keymirror({
  // Action of fetching quotas for all organizations
  ORGS_QUOTAS_FETCH: null,
  // Quotas for all orgs received
  ORGS_QUOTAS_RECEIVED: null,
  // Fetching quotas for all spaces
  SPACES_QUOTAS_FETCH: null,
  // Quotas for all spaces received
  SPACES_QUOTAS_RECEIVED: null
});

const orgActionTypes = keymirror({
  // When the user changes the current org they are looking at.
  ORG_CHANGE_CURRENT: null,
  // Action to fetch a single organization from the server.
  ORG_FETCH: null,
  // Action to fetch all the organizations from the server.
  ORGS_FETCH: null,
  // Action when all organizations are received from the server.
  ORGS_RECEIVED: null,
  // Action when organization is received from the server.
  ORG_RECEIVED: null,
  // Action when all organization summaries are received from the server.
  ORGS_SUMMARIES_RECEIVED: null,
  // Action when user toggles a space submenu in the sidenav
  ORG_TOGGLE_SPACE_MENU: null
});

const spaceActionTypes = keymirror({
  // Action to fetch a single space from the server.
  SPACE_FETCH: null,
  // Action to fetch all spaces (gets different information from single fetch,
  // such as quotas)
  SPACES_FETCH: null,
  // Action when a single space is received from the server.
  SPACE_RECEIVED: null,
  // Action when all spaces are received from the server.
  SPACES_RECEIVED: null,
  // When the user changes the current space they are looking at.
  SPACE_CHANGE_CURRENT: null
});

const serviceActionTypes = keymirror({
  // Action to fetch all services (for marketplace) for an org.
  SERVICES_FETCH: null,
  // Action when all services for an org were received from the server.
  SERVICES_RECEIVED: null,
  // Action when a single service plan received from server.
  SERVICE_PLAN_RECEIVED: null,
  // Action to fetch all service plans for a certain service.
  SERVICE_PLANS_FETCH: null,
  // Action when all service plans for a service were received from the server.
  SERVICE_PLANS_RECEIVED: null,
  // Action to decide whether to delete a single service instance.
  SERVICE_INSTANCE_DELETE_CONFIRM: null,
  // Action to decide whether to cancel deletion of a single service instance.
  SERVICE_INSTANCE_DELETE_CANCEL: null,
  // Action to delete a single service instance.
  SERVICE_INSTANCE_DELETE: null,
  // Action when a single service instance was deleted on the server.
  SERVICE_INSTANCE_DELETED: null,
  // Action to fetch a all service instances from the server.
  SERVICE_INSTANCES_FETCH: null,
  // Action when service instance was received from the server.
  SERVICE_INSTANCE_RECEIVED: null,
  // Action when all service instances were received from the server.
  SERVICE_INSTANCES_RECEIVED: null,
  // Action to open UI to create a service instance.
  SERVICE_INSTANCE_CREATE_FORM: null,
  // Action to cancel the form to create a service instance.
  SERVICE_INSTANCE_CREATE_FORM_CANCEL: null,
  // Action when an error happens attempting to create a service instance on
  // server.
  SERVICE_INSTANCE_ERROR: null,
  // Action to create a service instance.
  SERVICE_INSTANCE_CREATE: null,
  // Action when a service instance was created on the server.
  SERVICE_INSTANCE_CREATED: null,
  // Action when a user wants to modify the service instance.
  SERVICE_INSTANCE_CHANGE_CHECK: null,
  // Action when a user cancels modifying the instance.
  SERVICE_INSTANCE_CHANGE_CANCEL: null,
  // Action to fetch service bindins for an app.
  SERVICE_BINDINGS_FETCH: null,
  // Action when received service bindings from server.
  SERVICE_BINDINGS_RECEIVED: null,
  // Action to bind a service instance to an app.
  SERVICE_BIND: null,
  // Action to unbind a service instance from an app.
  SERVICE_UNBIND: null,
  // Action when a service instance was bound to an app.
  SERVICE_BOUND: null,
  // Aciton when a service instance was unbound from an app.
  SERVICE_UNBOUND: null
});

const appActionTypes = keymirror({
  // Action to fetch a single app from the server.
  APP_FETCH: null,
  // Action to fetch a single app's stats from the server.
  APP_STATS_FETCH: null,
  // Action when an app was received from the server.
  APP_RECEIVED: null,
  // Action when a app stats are received from the server.
  APP_STATS_RECEIVED: null,
  // Action when fetching all information about an app from the server.
  // The combined result of APP_FETCH and APP_STATS_FETCH
  APP_ALL_FETCH: null,
  // Action when all fetches come back from the server.
  APP_ALL_RECEIVED: null,
  // Action when user views a different app
  APP_CHANGE_CURRENT: null
});

const userActionTypes = keymirror({
  // Action to fetch users belonging to a organization from the server.
  ORG_USERS_FETCH: null,
  // Action to fetch the user roles for an org from the server.
  ORG_USER_ROLES_FETCH: null,
  // Action to fetch users belonging to a space from the server.
  SPACE_USERS_FETCH: null,
  // Action when all organization users were received from the server.
  ORG_USERS_RECEIVED: null,
  // Action when all org user roles were received from the server.
  ORG_USER_ROLES_RECEIVED: null,
  // Action when all space users were received from the server.
  SPACE_USERS_RECEIVED: null,
  // Action to add permissions to a user for a space or org on the server.
  USER_ROLES_ADD: null,
  // Action when user roles are added on the server.
  USER_ROLES_ADDED: null,
  // Action to delete persmissions to a user for a space or org on the server.
  USER_ROLES_DELETE: null,
  // Action when user roles are deleted on the server.
  USER_ROLES_DELETED: null,
  // Action to delete a user from an org.
  USER_DELETE: null,
  // Action when a user was deleted from an org on the server.
  USER_DELETED: null,
  // Action when there's an error when trying to remove a user.
  ERROR_REMOVE_USER: null,
  // Action when the type of users being looked at changes
  USER_CHANGE_VIEWED_TYPE: null,
  // Action when current user info received from server.
  CURRENT_USER_INFO_RECEIVED: null
});

const routeActionTypes = keymirror({
  // Action when a route needs to be assocated with an app.
  ROUTE_APP_ASSOCIATE: null,
  // Action when a route has been associated with an app
  ROUTE_APP_ASSOCIATED: null,
  // Action when a route is being unassociated from an app.
  ROUTE_APP_UNASSOCIATE: null,
  // Action when a route was unassociated from an app on the server.
  ROUTE_APP_UNASSOCIATED: null,
  // Action for creating routes
  ROUTE_CREATE: null,
  // Action when creating a new route fails, the route doesn't exist yet
  ROUTE_CREATE_ERROR: null,
  // Action for receiving the created route
  ROUTE_CREATED: null,
  // Action to create a route and associate it with an app
  ROUTE_CREATE_AND_ASSOCIATE: null,
  // Action for hiding route creation form
  ROUTE_CREATE_FORM_HIDE: null,
  // Action for showing route creation form
  ROUTE_CREATE_FORM_SHOW: null,
  // Action for removing a route from an app
  ROUTE_DELETE: null,
  // Action when a route has been deleted
  ROUTE_DELETED: null,
  // Action for updating a route
  ROUTE_UPDATE: null,
  // Action when a route has been updated
  ROUTE_UPDATED: null,
  ROUTES_FOR_APP_FETCH: null,
  ROUTES_FOR_APP_RECEIVED: null,
  ROUTE_TOGGLE_EDIT: null,
  // Action when any action on an existing route fails
  ROUTE_ERROR: null
});

const domainActionTypes = keymirror({
  DOMAIN_FETCH: null,
  DOMAIN_RECEIVED: null
});

const activityActionTypes = keymirror({
  EVENTS_FETCH: null,
  EVENTS_RECEIVED: null,
  LOGS_FETCH: null,
  LOGS_RECEIVED: null
});

export {
  activityActionTypes,
  appActionTypes,
  domainActionTypes,
  errorActionTypes,
  loginActionTypes,
  orgActionTypes,
  quotaActionTypes,
  routeActionTypes,
  spaceActionTypes,
  serviceActionTypes,
  userActionTypes
};
