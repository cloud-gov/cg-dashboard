
import keymirror from 'keymirror';


var errorActionTypes = keymirror({
  FETCH: null
});

var loginActionTypes = keymirror({
  FETCH_STATUS: null,
  RECEIVED_STATUS: null,
});

var orgActionTypes = keymirror({
  ORGS_FETCH: null,
  ORGS_RECEIVED: null
});

export { errorActionTypes, loginActionTypes, orgActionTypes };
