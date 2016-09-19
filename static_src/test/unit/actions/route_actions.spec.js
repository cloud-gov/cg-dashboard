
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

  describe('associateApp()', function() {
    it('should dispatch ROUTE_APP_ASSOCIATED view event & the app/route guids',
    function () {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';
      const expected = {
        appGuid,
        routeGuid
      };
      const spy = setupViewSpy(sandbox);

      routeActions.associateApp(routeGuid, appGuid);

      assertAction(spy, routeActionTypes.ROUTE_APP_ASSOCIATE, expected);
    })
  });

  describe('associatedApp()', function() {
    it('should dispatch ROUTE_APP_ASSOCIATED view event & the app/route guids',
    function () {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';
      const expected = {
        appGuid,
        routeGuid
      };
      const spy = setupServerSpy(sandbox);

      routeActions.associatedApp(routeGuid, appGuid);

      assertAction(spy, routeActionTypes.ROUTE_APP_ASSOCIATED, expected);
    })
  });

  describe('unassociateApp()', function() {
    it('should dispatch ROUTE_APP_UNASSOCIATE view event & the app/route guids',
    function () {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';
      const expected = {
        appGuid,
        routeGuid
      };
      const spy = setupViewSpy(sandbox);

      routeActions.unassociateApp(routeGuid, appGuid);

      assertAction(spy, routeActionTypes.ROUTE_APP_UNASSOCIATE, expected);
    })
  });

  describe('unassociatedApp()', function() {
    it('should dispatch ROUTE_APP_ASSOCIATED view event & the app/route guids',
    function () {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';
      const expected = {
        appGuid,
        routeGuid
      };
      const spy = setupServerSpy(sandbox);

      routeActions.unassociatedApp(routeGuid, appGuid);

      assertAction(spy, routeActionTypes.ROUTE_APP_UNASSOCIATED, expected);
    })
  });

  describe('createRoute()', function () {
    it('should dispatch ROUTE_CREATE view event with params', function () {
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const route = {
        host: 'fake-host',
        path: 'fake-path'
      };
      const expected = {
        domainGuid,
        spaceGuid,
        host: route.host,
        path: route.path
      };
      const spy = setupViewSpy(sandbox);

      routeActions.createRoute(domainGuid, spaceGuid, route);
      assertAction(spy, routeActionTypes.ROUTE_CREATE, expected);
    });
  });

  describe('errorCreateRoute()', function() {
    it('should dispatch a ROUTE_CREATE_ERROR with error object', function() {
      const err = { status: 500, data: { }};
      const params = {
        error: err
      };
      const spy = setupServerSpy(sandbox);

      routeActions.errorCreateRoute(err);

      assertAction(spy, routeActionTypes.ROUTE_CREATE_ERROR, params);
    });
  });

  describe('createdRoute()', function() {
    it('should dipsatch ROUTE_CREATED server event with route', function () {
      const route = { guid: 'fake-route-guid' };
      const spy = setupServerSpy(sandbox);

      routeActions.createdRoute(route);
      assertAction(spy, routeActionTypes.ROUTE_CREATED, { route });
    });
  });

  describe('createRouteAndAssociate()', function() {
    it('should dispatch ROUTE_CREATE_AND_ASSOCIATE view event with params', function() {
      const routeGuid = 'fake-route-guid';
      const appGuid = 'fake-app-guid';
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const route = {

      };
      const expected = {
        appGuid,
        domainGuid,
        spaceGuid,
        route
      };
      const spy = setupViewSpy(sandbox);

      routeActions.createRouteAndAssociate(appGuid, domainGuid, spaceGuid, route);
      assertAction(spy, routeActionTypes.ROUTE_CREATE_AND_ASSOCIATE, expected);
    });
  });

  describe('deleteRoute()', function() {
    it('should dispatch ROUTE_DELETE view event with route guid', function () {
      const routeGuid = 'fake-route-guid';
      const spy = setupViewSpy(sandbox);

      routeActions.deleteRoute(routeGuid);
      assertAction(spy, routeActionTypes.ROUTE_DELETE, { routeGuid });
    })
  })

  describe('deletedRoute()', function() {
    it('should dispatch ROUTE_DELETED view event with route guid', function () {
      const routeGuid = 'fake-route-guid';
      const spy = setupViewSpy(sandbox);

      routeActions.deletedRoute(routeGuid);
      assertAction(spy, routeActionTypes.ROUTE_DELETED, { routeGuid });
    })
  });

  describe('fetchRoutesForApp()', function() {
    it('should dispatch ROUTES_FOR_APP_FETCH view event with params', function() {
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

  describe('hideCreateForm()', function() {
    it('should dispatch ROUTE_CREATE_FORM_HIDE UI event', function() {
      const spy = setupUISpy(sandbox);

      routeActions.hideCreateForm();
      assertAction(spy, routeActionTypes.ROUTE_CREATE_FORM_HIDE);
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

  describe('showCreateForm()', function() {
    it('should dispatch ROUTE_CREATE_FORM_HIDE UI event', function() {
      const spy = setupUISpy(sandbox);

      routeActions.showCreateForm();
      assertAction(spy, routeActionTypes.ROUTE_CREATE_FORM_SHOW);
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

      assertAction(spy, routeActionTypes.ROUTE_TOGGLE_EDIT, expectedParams);
    });
  });

  describe('updateRoute()', function (){
    it('should dispatch ROUTE_UPDATE view event with params', function() {
      const routeGuid = 'fake-route-guid';
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const route = {
        host: 'fake-host',
        path: 'fake-path'
      };
      const expected = {
        routeGuid,
        domainGuid,
        spaceGuid,
        route
      };
      const spy = setupViewSpy(sandbox);

      routeActions.updateRoute(routeGuid, domainGuid, spaceGuid, route)
      assertAction(spy, routeActionTypes.ROUTE_UPDATE, expected);
    });
  });

  describe('updatedRoute()', function (){
    it('should dispatch ROUTE_UPDATED server event with params', function() {
      const routeGuid = 'fake-route-guid';
      const route = {
        host: 'fake-host',
        path: 'fake-path'
      };
      const spy = setupServerSpy(sandbox);

      routeActions.updatedRoute(routeGuid, route);
      assertAction(spy, routeActionTypes.ROUTE_UPDATED, { routeGuid, route });
    });
  });

  describe('error()', function() {
    it('should dispatch route error with route guid and error', function() {
      const routeGuid = 'adfzcvb2cvb435n';
      const err = { status: 500, data: { }};
      const params = {
        routeGuid: routeGuid,
        error: err
      };
      const spy = setupServerSpy(sandbox);

      routeActions.error(routeGuid, err);

      assertAction(spy, routeActionTypes.ROUTE_ERROR, params);
    });
  });
});
