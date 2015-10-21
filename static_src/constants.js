
import keymirror from 'keymirror';


var errorActionTypes = keymirror({
  FETCH: null
});

var loginActionTypes = keymirror({
  FETCH_STATUS: null,
  RECEIVED_STATUS: null,
});

var orgActionTypes = keymirror({
  ORG_CHANGE_CURRENT: null,
  ORG_FETCH: null,
  ORGS_FETCH: null,
  ORGS_RECEIVED: null,
  ORG_RECEIVED: null
});

var spaceActionTypes = keymirror({
  SPACE_FETCH: null,
  SPACE_RECEIVED: null
});

var serviceActionTypes = keymirror({
  SERVICE_INSTANCE_DELETE: null,
  SERVICE_INSTANCE_DELETED: null,
  SERVICE_INSTANCES_FETCH: null,
  SERVICE_INSTANCES_RECEIVED: null
});

var appActionTypes = keymirror({
  APP_FETCH: null,
  APP_RECEIVED: null
});

var userActionTypes = keymirror({
  SPACE_USERS_FETCH: null,
  SPACE_USERS_RECEIVED: null
});

export { appActionTypes, errorActionTypes, loginActionTypes, orgActionTypes,
  spaceActionTypes, serviceActionTypes, userActionTypes };
