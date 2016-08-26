
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupViewSpy, setupServerSpy, setupUISpy } from '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import routeActions from '../../../actions/route_actions.js';
import { routeActionTypes } from '../../../constants.js';

describe('routeActions', function() {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchRoutesForApp()', function() {
    it('should dispatch a view event of type routes for app fetch', function() {
      var expectedAppGuid = 'asdflkjzzxcv',
          expectedParams = {
            appGuid: expectedAppGuid
          };

      let spy = setupViewSpy(sandbox)

      routeActions.fetchRoutesForApp(expectedAppGuid);

      assertAction(spy, routeActionTypes.ROUTES_FOR_APP_FETCH,
                   expectedParams)
    });
  });

  describe('receivedRoutesForApp()', function() {
    it('should dispatch a server event of type routes for app resv with data',
        function() {
      const appGuid = 'adflkjzxcbvzxqwr12';
      const expected = {
        resources: [
          { guid: 'asdfa', host: 'somethingxz' }
        ]
      }
      const expectedParams = {
        routes: expected,
        appGuid: appGuid
      };

      let spy = setupServerSpy(sandbox)

      routeActions.receivedRoutesForApp(expected, appGuid);

      assertAction(spy, routeActionTypes.ROUTES_FOR_APP_RECEIVED,
                   expectedParams)
    });
  });

  describe('toggleEdit()', function () {
    it('should dispatch a UI action with a route guid', function () {
      var expectedRouteGuid = 'route-guid',
          expectedParams = {
            routeGuid: expectedRouteGuid
          };

      let spy = setupUISpy(sandbox)

      routeActions.toggleEdit(expectedRouteGuid);

      assertAction(spy, routeActionTypes.ROUTE_TOGGLE_EDIT,
                   expectedParams)
    });
  });
});
