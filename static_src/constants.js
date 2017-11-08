import keymirror from "keymirror";

const appStates = {
  crashed: "CRASHED",
  down: "DOWN",
  flapping: "FLAPPING",
  unknown: "UNKNOWN",
  restarting: "RESTARTING",
  running: "RUNNING",
  started: "STARTED",
  starting: "STARTING",
  stopped: "STOPPED",
  default: "STOPPED"
};

// Descriptive states to represent entity health
const entityHealth = keymirror({
  // Healthy entity
  ok: null,
  // Something is not right, might want to investigate
  warning: null,
  // Something is definitely not right and requires some attention
  error: null,
  // Entity process was successful
  finish: null,
  // Entity is inactive
  inactive: null,
  // This warrants a bug, so we can figure out what the correct health
  // assessment is when in this state
  unknown: null
});

const envActionTypes = keymirror({
  ENV_FETCH_ENV_REQUEST: null,
  ENV_FETCH_ENV_SUCCESS: null,
  ENV_FETCH_ENV_FAILURE: null,
  ENV_INVALIDATE_UPDATE_ERROR: null
});

// All global error action types
const errorActionTypes = keymirror({
  FETCH: null,
  IMPORTANT_FETCH: null,
  DISMISS: null,
  CLEAR: null,
  NOTIFY: null
});

const formActionTypes = keymirror({
  // User has changed a form field
  FORM_FIELD_CHANGE: null,
  // The form field change was valid
  FORM_FIELD_CHANGE_SUCCESS: null,
  // The form field change is not a valid input
  FORM_FIELD_CHANGE_ERROR: null
});

const loginActionTypes = keymirror({
  // Action of fetching a login status, whether the user is logged in or not.
  FETCH_STATUS: null,
  // Login status is unknown, an error occurred.
  ERROR_STATUS: null,
  // Action when the login status is received from the server.
  RECEIVED_STATUS: null
});

const pageActionTypes = keymirror({
  // When a browser page starts loading e.g. during navigation
  PAGE_LOAD_STARTED: null,
  // All data for rendering the page has loaded successfully
  PAGE_LOAD_SUCCESS: null,
  // An error occurred when loading the page
  PAGE_LOAD_ERROR: null
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
  ORG_TOGGLE_SPACE_MENU: null,
  // Action when a user opens up an org quick look
  ORG_TOGGLE_QUICKLOOK: null,
  // Action when the toggle completes successfully
  ORG_TOGGLE_QUICKLOOK_SUCCESS: null,
  // Action when the toggle fails to complete
  ORG_TOGGLE_QUICKLOOK_ERROR: null
});

const spaceActionTypes = keymirror({
  // Action to fetch a single space from the server.
  SPACE_FETCH: null,
  // Action to fetch all spaces (gets different information from single fetch,
  // such as quotas)
  SPACES_FETCH: null,
  // Action to fetch all spaces for an org
  SPACES_FOR_ORG_FETCH: null,
  // Action when a single space is received from the server.
  SPACE_RECEIVED: null,
  // Action when all spaces are received from the server.
  SPACES_RECEIVED: null,
  // When the user changes the current space they are looking at.
  SPACE_CHANGE_CURRENT: null
});

const serviceActionTypes = keymirror({
  // Services
  // Action to bind a service instance to an app.
  SERVICE_BIND: null,
  // Action when a service instance was bound to an app.
  SERVICE_BOUND: null,
  // Action to unbind a service instance from an app.
  SERVICE_UNBIND: null,
  // Aciton when a service instance was unbound from an app.
  SERVICE_UNBOUND: null,
  // Action to fetch all services (for marketplace) for an org.
  SERVICES_FETCH: null,
  // Action when all services for an org were received from the server.
  SERVICES_RECEIVED: null,

  // Service Bindings
  // Action to fetch service bindins for an app.
  SERVICE_BINDINGS_FETCH: null,
  // Action when received service bindings from server.
  SERVICE_BINDINGS_RECEIVED: null,

  // Service Plans
  // Action when a single service plan is fetched from server.
  SERVICE_PLAN_FETCH: null,
  // Action when a single service plan received from server.
  SERVICE_PLAN_RECEIVED: null,
  // Action to fetch all service plans for a certain service.
  SERVICE_PLANS_FETCH: null,
  // Action when all service plans for a service were received from the server.
  SERVICE_PLANS_RECEIVED: null,

  // Service Instances
  // Action when a user wants to modify the service instance.
  SERVICE_INSTANCE_CHANGE_CHECK: null,
  // Action when a user cancels modifying the instance.
  SERVICE_INSTANCE_CHANGE_CANCEL: null,
  // Action to create a service instance.
  SERVICE_INSTANCE_CREATE: null,
  // Action when an error happens attempting to create a service instance on
  // server.
  SERVICE_INSTANCE_CREATE_ERROR: null,
  // Action to open UI to create a service instance.
  SERVICE_INSTANCE_CREATE_FORM: null,
  // Action to cancel the form to create a service instance.
  SERVICE_INSTANCE_CREATE_FORM_CANCEL: null,
  // Action when a service instance was created on the server.
  SERVICE_INSTANCE_CREATED: null,
  // Action to delete a single service instance.
  SERVICE_INSTANCE_DELETE: null,
  // Action when a single service instance was deleted on the server.
  SERVICE_INSTANCE_DELETED: null,
  // Action to decide whether to cancel deletion of a single service instance.
  SERVICE_INSTANCE_DELETE_CANCEL: null,
  // Action to decide whether to delete a single service instance.
  SERVICE_INSTANCE_DELETE_CONFIRM: null,
  // Action when any error happens with a specific instance.
  SERVICE_INSTANCE_ERROR: null,
  // Action when service instance is fetched from the server.
  SERVICE_INSTANCE_FETCH: null,
  // Action when service instance was received from the server.
  SERVICE_INSTANCE_RECEIVED: null,
  // Action to fetch a all service instances from the server.
  SERVICE_INSTANCES_FETCH: null,
  // Action when all service instances were received from the server.
  SERVICE_INSTANCES_RECEIVED: null
});

const appActionTypes = keymirror({
  // Action to fetch a single app from the server.
  APP_FETCH: null,
  // Action to fetch a single app's stats from the server.
  APP_STATS_FETCH: null,
  // Action when an app was received from the server.
  APP_RECEIVED: null,
  // Action update an app's parameters
  APP_UPDATE: null,
  // Action app update has completed.
  APP_UPDATED: null,
  // Action when a app stats are received from the server.
  APP_STATS_RECEIVED: null,
  // Action when fetching all information about an app from the server.
  // The combined result of APP_FETCH and APP_STATS_FETCH
  APP_ALL_FETCH: null,
  // Action when all fetches come back from the server.
  APP_ALL_RECEIVED: null,
  // Action when user views a different app
  APP_CHANGE_CURRENT: null,
  // Action when starting an app.
  APP_START: null,
  // Action when request to start app completed on server.
  APP_STARTED: null,
  // Action when restarting an app.
  APP_RESTART: null,
  // Action when app restarted on server.
  APP_RESTARTED: null,
  // Action when some error happens when manipulating an app
  APP_ERROR: null,
  // Action when the fetching of app fails
  APP_FETCH_ERROR: null
});

const userActionTypes = keymirror({
  // Action to fetch users belonging to a organization from the server.
  ORG_USERS_FETCH: null,
  // Action to fetch the user roles for an org from the server.
  ORG_USER_ROLES_FETCH: null,
  // Action to fetch users belonging to a space from the server.
  SPACE_USER_ROLES_FETCH: null,
  // Action when all organization users were received from the server.
  ORG_USERS_RECEIVED: null,
  // Action when all org user roles were received from the server.
  ORG_USER_ROLES_RECEIVED: null,
  // Action when all space users were received from the server.
  SPACE_USER_ROLES_RECEIVED: null,
  // User is fetched from the server
  USER_FETCH: null,
  // User is received from the server
  USER_RECEIVED: null,
  // Fetch spaces this user is a member of (developer of).
  USER_SPACES_FETCH: null,
  // Receive spaces this user is a member of (developer of).
  USER_SPACES_RECEIVED: null,
  // Fetch orgss this user is a member of (manager of).
  USER_ORGS_FETCH: null,
  // Receive orgss this user is a member of (manager of).
  USER_ORGS_RECEIVED: null,
  // Action to add permissions to a user for a space or org on the server.
  USER_ROLES_ADD: null,
  // Action when user roles are added on the server.
  USER_ROLES_ADDED: null,
  // Action to delete persmissions to a user for a space or org on the server.
  USER_ROLES_DELETE: null,
  // Action when user roles are deleted on the server.
  USER_ROLES_DELETED: null,
  // Action when there is an error changing a user's role
  USER_ROLE_CHANGE_ERROR: null,
  // Action to request an invite link from UAA, with user GUID.
  USER_INVITE_TRIGGER: null,
  // Action to trigger when invite status is triggered for front end.
  USER_INVITE_STATUS_UPDATED: null,
  // Action to trigger when user list notice is created.
  USER_LIST_NOTICE_CREATED: null,
  // Action to associate user to an organization.
  USER_ORG_ASSOCIATE: null,
  // Action when user is associated to an organization.
  USER_ORG_ASSOCIATED: null,
  // Action to associate user to a space.
  USER_SPACE_ASSOCIATE: null,
  // Action when user is associated to a space.
  USER_SPACE_ASSOCIATED: null,
  // Display the user associated to org.
  USER_ASSOCIATED_ORG_DISPLAYED: null,
  // Action when something goes wrong in user invite and email process.
  USER_INVITE_ERROR: null,
  // Action to dismiss an user list notification.
  USER_LIST_NOTICE_DISMISSED: null,
  // Action to remove all roles for space user.
  USER_REMOVE_ALL_SPACE_ROLES: null,
  // Action when all roles for space user are removed.
  USER_REMOVED_ALL_SPACE_ROLES: null,
  // Action to delete a user from an org.
  USER_DELETE: null,
  // Action when a user was deleted from an org on the server.
  USER_DELETED: null,
  // Action when there's an error when trying to remove a user.
  ERROR_REMOVE_USER: null,
  // Action when the type of users being looked at changes
  USER_CHANGE_VIEWED_TYPE: null,
  // Meta action that we are fetching the multiple pieces that make up the current user
  CURRENT_USER_FETCH: null,
  // Meta action that the current user is loaded
  CURRENT_USER_RECEIVED: null,
  // An error occurred while loading the current user
  CURRENT_USER_ERROR: null,
  // Current user info fetched from server.
  CURRENT_USER_INFO_FETCH: null,
  // Action when current user info received from server.
  CURRENT_USER_INFO_RECEIVED: null,
  // Current UAA info fetched from server.
  CURRENT_UAA_INFO_FETCH: null,
  // Action when current UAA info received from server.
  CURRENT_UAA_INFO_RECEIVED: null,
  // Action to fetch roles of current user.
  CURRENT_USER_ROLES_FETCH: null,
  // Action when roles for current user are received.
  CURRENT_USER_ROLES_RECEIVED: null
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
  ROUTES_FOR_SPACE_FETCH: null,
  ROUTES_RECEIVED: null,
  ROUTE_TOGGLE_EDIT: null,
  // Action when route is being deleted or unbound for the app.
  ROUTE_TOGGLE_REMOVE: null,
  // Action when any action on an existing route fails
  ROUTE_ERROR: null
});

const routerActionTypes = keymirror({
  NAVIGATE: null
});

const domainActionTypes = keymirror({
  DOMAIN_FETCH: null,
  DOMAIN_RECEIVED: null
});

const activityActionTypes = keymirror({
  EVENTS_FETCH: null,
  EVENTS_RECEIVED: null,

  // An error occurred while fetching logs
  LOGS_ERROR: null,
  LOGS_FETCH: null,
  LOGS_RECEIVED: null
});

const upsiActionTypes = keymirror({
  UPSI_FETCH_ALL_REQUEST: null,
  UPSI_FETCH_ALL_SUCCESS: null,
  UPSI_FETCH_ALL_FAILURE: null,
  UPSI_FETCH_ALL_FOR_SPACE_REQUEST: null,
  UPSI_FETCH_ALL_FOR_SPACE_SUCCESS: null,
  UPSI_FETCH_ALL_FOR_SPACE_FAILURE: null
});

export {
  activityActionTypes,
  appActionTypes,
  entityHealth,
  envActionTypes,
  appStates,
  domainActionTypes,
  errorActionTypes,
  formActionTypes,
  loginActionTypes,
  orgActionTypes,
  pageActionTypes,
  quotaActionTypes,
  routeActionTypes,
  routerActionTypes,
  spaceActionTypes,
  serviceActionTypes,
  upsiActionTypes,
  userActionTypes
};
