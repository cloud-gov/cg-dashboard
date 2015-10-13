
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

export { errorActionTypes, loginActionTypes, orgActionTypes, spaceActionTypes };
