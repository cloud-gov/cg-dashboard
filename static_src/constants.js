
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
  // Action when a single space is received from the server.
  SPACE_RECEIVED: null
});

const serviceActionTypes = keymirror({
  // Action to fetch all services (for marketplace) for an org.
  SERVICES_FETCH: null,
  // Action when all services for an org were received from the server.
  SERVICES_RECEIVED: null,
  // Action to fetch all service plans for a certain service.
  SERVICE_PLANS_FETCH: null,
  // Action when all service plans for a service were received from the server.
  SERVICE_PLANS_RECEIVED: null,
  // Action to delete a single service instance.
  SERVICE_INSTANCE_DELETE: null,
  // Action when a single service instance was deleted on the server.
  SERVICE_INSTANCE_DELETED: null,
  // Action to fetch a all service instances from the server.
  SERVICE_INSTANCES_FETCH: null,
  // Action when all service instances were received from the server.
  SERVICE_INSTANCES_RECEIVED: null,
  // Action to open UI to create a service instance.
  SERVICE_INSTANCE_CREATE_FORM: null,
  // Action when an error happens attempting to create a service instance on
  // server.
  SERVICE_INSTANCE_ERROR: null,
  // Action to create a service instance.
  SERVICE_INSTANCE_CREATE: null,
  // Action when a service instance was created on the server.
  SERVICE_INSTANCE_CREATED: null
});

const appActionTypes = keymirror({
  // Action to fetch a single app from the server.
  APP_FETCH: null,
  // Action to fetch a single app's stats from the server.
  APP_STATS_FETCH: null,
  // Action when an app was received from the server.
  APP_RECEIVED: null,
  // Action when a app stats are received from the server.
  APP_STATS_RECEIVED: null
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
  ERROR_REMOVE_USER: null
});

const routeActionTypes = keymirror({
  ROUTES_FOR_APP_FETCH: null,
  ROUTES_FOR_APP_RECEIVED: null
});

const domainActionTypes = keymirror({
  DOMAIN_FETCH: null,
  DOMAIN_RECEIVED: null
});

export { appActionTypes, domainActionTypes, errorActionTypes, loginActionTypes,
  orgActionTypes, routeActionTypes, spaceActionTypes, serviceActionTypes,
  userActionTypes };
