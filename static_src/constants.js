
import keymirror from 'keymirror';


// All global error action types
var errorActionTypes = keymirror({
  FETCH: null
});

var loginActionTypes = keymirror({
  // Action of fetching a login status, whether the user is logged in or not.
  FETCH_STATUS: null,
  // Action when the login status is received from the server.
  RECEIVED_STATUS: null,
});

var orgActionTypes = keymirror({
  // When the user changes the current org they are looking at.
  ORG_CHANGE_CURRENT: null,
  // Action to fetch a single organization from the server.
  ORG_FETCH: null,
  // Action to fetch all the organizations from the server.
  ORGS_FETCH: null,
  // Action when all organizations are received from the server.
  ORGS_RECEIVED: null,
  // Action when when organization is received from the server.
  ORG_RECEIVED: null
});

var spaceActionTypes = keymirror({
  // Action to fetch a single space from the server.
  SPACE_FETCH: null,
  // Action when a single space is received from the server.
  SPACE_RECEIVED: null
});

var serviceActionTypes = keymirror({
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
  // Action to create a service instance.
  SERVICE_INSTANCE_CREATE: null,
  // Action when a service instance was created on the server.
  SERVICE_INSTANCE_CREATED: null
});

var appActionTypes = keymirror({
  // Action to fetch a single app from the server.
  APP_FETCH: null,
  // Action when an app was received from the server.
  APP_RECEIVED: null
});

var userActionTypes = keymirror({
  // Action to fetch users belonging to a organization from the server.
  ORG_USERS_FETCH: null,
  // Action to fetch users belonging to a space from the server.
  SPACE_USERS_FETCH: null,
  // Action when all organization users were received from the server.
  ORG_USERS_RECEIVED: null,
  // Action when all space users were received from the server.
  SPACE_USERS_RECEIVED: null,
  // Action to delete a user from an org.
  USER_DELETE: null,
  // Action when a user was deleted from an org on the server.
  USER_DELETED: null,
  // Action when there's an error when trying to remove a user.
  ERROR_REMOVE_USER: null
});

export { appActionTypes, errorActionTypes, loginActionTypes, orgActionTypes,
  spaceActionTypes, serviceActionTypes, userActionTypes };
