
import Immutable from 'immutable';

import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import routeActions from '../../../actions/route_actions.js';
import RouteStore from '../../../stores/route_store.js';
import { domainActionTypes, routeActionTypes } from '../../../constants';

describe('RouteStore', function() {
  var sandbox;

  beforeEach(() => {
    RouteStore._data = Immutable.List();
    RouteStore.error = null;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', function() {
    it('should start data as empty array', function() {
      expect(RouteStore.getAll()).toBeEmptyArray();
      expect(RouteStore.error).toEqual(null);
    });
  });

  describe('routeActionTypes.ROUTE_APP_ASSOCIATED', function () {
    it('should call put ap route assocaation with app, route guid', function() {
      const appGuid = 'zxvnalsf25gh9';
      const routeGuid = 'xvxvcmnsdjfkh3jdf';
      const spy = sandbox.spy(cfApi, 'putAppRouteAssociation');

      routeActions.associateApp(routeGuid, appGuid);

      expect(spy).toHaveBeenCalledOnce();
      const args = spy.getCall(0).args;
      expect(args[0]).toEqual(appGuid);
      expect(args[1]).toEqual(routeGuid);
    });
  });

  describe('routeActionTypes.ROUTE_APP_ASSOCIATED', function () {
    it('should add app_guid to the route object and set editing, error to false',
        function () {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';

      RouteStore.push({ guid: routeGuid, editing: true });

      AppDispatcher.handleServerAction({
        type: routeActionTypes.ROUTE_APP_ASSOCIATED,
        appGuid,
        routeGuid
      });

      const actual = RouteStore.get(routeGuid);
      expect(actual.app_guid).toEqual(appGuid);
      expect(actual.editing).toEqual(false);
      expect(actual.error).toBeFalsy();
    });

    it('should set showCreateRouteForm and error to false and emitChange()',
        function () {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';
      const spy = sandbox.spy(RouteStore, 'emitChange');

      RouteStore.showCreateRouteForm = true;
      AppDispatcher.handleServerAction({
        type: routeActionTypes.ROUTE_APP_ASSOCIATED,
        appGuid,
        routeGuid
      });

      expect(RouteStore.showCreateRouteForm).toEqual(false);
      expect(RouteStore.error).toEqual(null);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on route app unnassociate', function() {
    it('should call the cf api unassociate route app with app, route guid',
      function() {
      const spy = sandbox.stub(cfApi, 'deleteAppRouteAssociation');
      spy.returns(Promise.resolve({data: {}}));
      const appGuid = 'adfa3456vcsdf';
      const routeGuid = 'zxcv8zvcx234';

      routeActions.unassociateApp(routeGuid, appGuid);

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(appGuid);
      expect(args[1]).toEqual(routeGuid);
    });
  });

  describe('on route app unnassociated', function() {
    const routeGuid = 'zxcvsdlfjka1231';
    const appGuid = 'zcxv98xcv234';

    it('should remove the app guid route if found', function() {
      RouteStore._data = Immutable.fromJS([{ guid: routeGuid, appGuid: appGuid }]);

      routeActions.unassociatedApp(routeGuid, appGuid);

      const route = RouteStore.get(routeGuid);

      expect(route.app_guid).toBeFalsy();
    });

    it('should emit a change', function() {
      RouteStore._data = Immutable.fromJS([{ guid: routeGuid, appGuid: appGuid }]);

      const spy = sandbox.spy(RouteStore, 'emitChange');

      routeActions.unassociatedApp(routeGuid, appGuid);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('routeActionTypes.ROUTE_CREATE', function() {
    it('should call cfApi.createRoute with params', function (){
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const host = 'fake-host';
      const path = 'fake-path';
      const spy = sandbox.spy(cfApi, 'createRoute');

      AppDispatcher.handleViewAction({
        type: routeActionTypes.ROUTE_CREATE,
        domainGuid,
        spaceGuid,
        host,
        path
      });

      const args = spy.getCall(0).args;
      expect(spy).toHaveBeenCalledOnce();
      expect(args).toEqual([domainGuid, spaceGuid, host, path]);
    });
  });

  describe('on route create error', function() {
    const testCFError = {
      code: 210003,
      description: 'The host is taken: testapp01',
      error_code: 'CF-RouteHostTaken'
    };

    it('should set the create error to the error object', function() {
      const expected = testCFError;
      routeActions.errorCreateRoute(expected);

      const actual = RouteStore.error;

      expect(actual).toEqual(expected);
    });

    it('should emit a change event', function() {
      const spy = sandbox.spy(RouteStore, 'emitChange');
      routeActions.errorCreateRoute(testCFError);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('routeActionTypes.ROUTE_CREATE_AND_ASSOCIATE', function() {
    it('should emitChange()', function () {
      const appGuid = 'fake-app-guid';
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const route = {
        host: 'fake-host',
        path: 'fake-path'
      };
      const spy = sandbox.spy(RouteStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: routeActionTypes.ROUTE_CREATE_AND_ASSOCIATE,
        appGuid,
        domainGuid,
        spaceGuid,
        route
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should call cfApi.createRoute and then cfApi.putAppRouteAssociation', function() {
      const appGuid = 'fake-app-guid';
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const route = {
        host: 'fake-host',
        path: 'fake-path'
      };
      const createRouteSpy = sandbox.stub(cfApi, 'createRoute');
      const putAppRouteAssociationSpy = sandbox.stub(cfApi, 'putAppRouteAssociation');

      createRouteSpy.returns(Promise.resolve());
      putAppRouteAssociationSpy.returns(Promise.resolve());

      AppDispatcher.handleViewAction({
        type: routeActionTypes.ROUTE_CREATE_AND_ASSOCIATE,
        appGuid,
        domainGuid,
        spaceGuid,
        route
      });

      expect(createRouteSpy).toHaveBeenCalledOnce();
      // TODO: unsure of how to test the putAppRouteAssociation part
    });
  });

  describe('routeActionTypes.ROUTE_CREATE_FORM_HIDE', function() {
    it('should set showCreateRouteForm, error to false and emitChange()',
        function () {
      const spy = sandbox.spy(RouteStore, 'emitChange');

      RouteStore.showCreateRouteForm = true;
      AppDispatcher.handleUIAction({
        type: routeActionTypes.ROUTE_CREATE_FORM_HIDE
      })

      expect(RouteStore.showCreateRouteForm).toEqual(false);
      expect(RouteStore.error).toEqual(null);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('routeActionTypes.ROUTE_CREATE_FORM_SHOW', function () {
    it('should set showCreateRouteForm, error to true and emitChange()',
        function () {
      const spy = sandbox.spy(RouteStore, 'emitChange');

      RouteStore.showCreateRouteForm = false;
      AppDispatcher.handleUIAction({
        type: routeActionTypes.ROUTE_CREATE_FORM_SHOW
      })

      expect(RouteStore.showCreateRouteForm).toEqual(true);
      expect(RouteStore.error).toEqual(null);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('routeActionTypes.ROUTE_CREATED', function () {
    it('should add route and emitChange()', function () {
      const routeGuid = 'fake-route-guid';
      const route = wrapInRes([ { guid: routeGuid } ])[0];
      const spy = sandbox.spy(RouteStore, 'emitChange');

      AppDispatcher.handleServerAction({
        type: routeActionTypes.ROUTE_CREATED,
        route
      });

      expect(RouteStore.get(routeGuid)).toEqual({ guid: routeGuid });
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('routeActionTypes.ROUTE_DELETE', function () {
    it('should call cfApi.deleteRoute with a route guid', function () {
      const routeGuid = 'fake-route-guid';
      const spy = sandbox.spy(cfApi, 'deleteRoute');

      AppDispatcher.handleViewAction({
        type: routeActionTypes.ROUTE_DELETE,
        routeGuid
      });

      const arg = spy.getCall(0).args[0];
      expect(spy).toHaveBeenCalledOnce();
      expect(arg).toEqual(routeGuid);
    });
  });

  describe('routeActionTypes.ROUTE_DELETED', function () {
    it('should remove the route and emitChange()', function () {
      const routeGuid = 'fake-route-guid';
      const spy = sandbox.spy(RouteStore, 'emitChange');

      RouteStore._data = Immutable.fromJS([{ guid: routeGuid }]);

      AppDispatcher.handleViewAction({
        type: routeActionTypes.ROUTE_DELETED,
        routeGuid
      });

      expect(RouteStore.getAll().length).toEqual(0);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('routeActionTypes.ROUTES_FOR_APP_FETCH', function() {
    it('should fetch routes for app with app guid from api', function() {
      var spy = sandbox.spy(cfApi, 'fetchRoutesForApp'),
          expectedGuid = 'adfasdzcvzxcvb23r';

      AppDispatcher.handleViewAction({
        type: routeActionTypes.ROUTES_FOR_APP_FETCH,
        appGuid: expectedGuid
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });
  });

  describe('on route for space fetch', function() {
    it('should fetch routes for space with space guid from api', function() {
      const spy = sandbox.spy(cfApi, 'fetchRoutesForSpace');
      const expectedGuid = 'adfasdzcvzxcvb23r';

      routeActions.fetchRoutesForSpace(expectedGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });
  });

  describe('on routes received', function() {
    it('should emit a change event if new routes', function() {
      const spy = sandbox.spy(RouteStore, 'emitChange');

      routeActions.receivedRoutes([{ metadata: { guid: 'zxcv' }, entity: {}}]);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should merge in the routes with mergeMany', function() {
      const spy = sandbox.spy(RouteStore, 'mergeMany');

      routeActions.receivedRoutes([{ metadata: { guid: 'zxcv' }, entity: {}}]);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on routes received for app', function() {
    it('should emit a change event', function() {
      const appGuid = '2893hazxcmv';
      const spy = sandbox.spy(RouteStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: routeActionTypes.ROUTES_FOR_APP_RECEIVED,
        appGuid: appGuid,
        routes: wrapInRes([ { guid: 'adsfa' } ])
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should add the appGuid to each route', function() {
      const sharedGuid = 'zxcb234xcvb4567';

      let routeA = { guid: 'zxcb1234adfg098', host: 'tim' };

      AppDispatcher.handleServerAction({
        type: routeActionTypes.ROUTES_FOR_APP_RECEIVED,
        appGuid: sharedGuid,
        routes: wrapInRes([ routeA ])
      });

      let actual = RouteStore.get(routeA.guid);

      expect(actual).toEqual(
        Object.assign({}, routeA, { app_guid: sharedGuid }));
    });

    it('should merge all the routes in', function() {
      const sharedGuid = 'zxcb234nvc654ad';
      const spy = sandbox.spy(RouteStore, 'mergeMany');
      const existingRoute = { guid: 'zxcb', app_guid: sharedGuid };

      RouteStore.push(existingRoute);

      const newRoute = { guid: 'zxcb', host: '18f' };

      AppDispatcher.handleServerAction({
        type: routeActionTypes.ROUTES_FOR_APP_RECEIVED,
        appGuid: sharedGuid,
        routes: wrapInRes([newRoute])
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith('guid');
    });

    it('should fetch shared or private domain for each route', function() {
      const sharedDomainGuid = 'zxcvzxcvzcxv23';
      const privateDomainGuid = '23fdvskdcxv25';
      const spyShared = sandbox.spy(cfApi, 'fetchSharedDomain');
      const spyPrivate = sandbox.spy(cfApi, 'fetchPrivateDomain');
      const routeA = {
        metadata: { guid: 'aldfjzxcbkvzxcb' },
        entity: {
          domain_guid: sharedDomainGuid,
          domain_url: 'shared_domains'
        }
      };
      const routeB = {
        metadata: { guid: 'aldf23vx32xcb' },
        entity: {
          domain_guid: privateDomainGuid,
          domain_url: 'private_domains'
        }
      };

      routeActions.receivedRoutesForApp([routeA, routeB]);

      expect(spyShared).toHaveBeenCalledOnce();
      expect(spyPrivate).toHaveBeenCalledOnce();
    });
  });

  describe('routeActionTypes.ROUTE_TOGGLE_EDIT', function () {
    it('should toggle the "editing" value of the route', function () {
      const routeGuid = 'route-guid';
      const route = { guid: routeGuid };

      RouteStore.push(route);

      AppDispatcher.handleUIAction({
        type: routeActionTypes.ROUTE_TOGGLE_EDIT,
        routeGuid
      });

      const actual = RouteStore.get(routeGuid);
      const expected = Object.assign({}, route, {
        editing: true
      });

      expect(actual).toEqual(expected);
    });
  });

  describe('on route toggle remove', function() {
    it('should toggle the "editing" value of the route', function () {
      const routeGuid = 'route-guid';
      const route = { guid: routeGuid };

      RouteStore.push(route);

      AppDispatcher.handleUIAction({
        type: routeActionTypes.ROUTE_TOGGLE_REMOVE,
        routeGuid
      });

      const actual = RouteStore.get(routeGuid);
      const expected = Object.assign({}, route, {
        removing: true
      });

      expect(actual).toEqual(expected);
    });
  });

  describe('routeActionTypes.ROUTE_UPDATE', function () {
    it('should call cfApi.putRouteUpdate with params', function () {
      const routeGuid = 'fake-route-guid';
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const route = {
        host: 'fake-host',
        path: 'fake-path'
      };
      const spy = sandbox.spy(cfApi, 'putRouteUpdate');

      AppDispatcher.handleViewAction({
        type: routeActionTypes.ROUTE_UPDATE,
        routeGuid,
        domainGuid,
        spaceGuid,
        route
      });

      const args = spy.getCall(0).args;
      expect(spy).toHaveBeenCalledWith();
      expect(args).toEqual([routeGuid, domainGuid, spaceGuid, route]);
    });
  });

  describe('routeActionTypes.ROUTE_UPDATED', function () {
    it('should update route and set editing, error to false', function () {
      const routeGuid = 'fake-route-guid';
      const route = { guid: routeGuid, foo: 'bar' };

      RouteStore.push({ guid: routeGuid, editing: true });

      AppDispatcher.handleServerAction({
        type: routeActionTypes.ROUTE_UPDATED,
        routeGuid,
        route
      });

      expect(RouteStore.get(routeGuid).foo).toEqual('bar');
      expect(RouteStore.get(routeGuid).editing).toEqual(false);
      expect(RouteStore.get(routeGuid).err).toBeFalsy();
    });

    it('should emitChange()', function () {
      const routeGuid = 'fake-route-guid';
      const route = { guid: routeGuid };
      const spy = sandbox.spy(RouteStore, 'emitChange');

      AppDispatcher.handleServerAction({
        type: routeActionTypes.ROUTE_UPDATED,
        routeGuid,
        route
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on route error', function() {
    const testCFError = {
      code: 210003,
      description: 'The host is taken: testapp01',
      error_code: 'CF-RouteHostTaken'
    };

    it('should toggle the "error" value of the route', function () {
      const routeGuid = 'route-guid-zcvzxcv';
      const route = { guid: routeGuid };
      const err = testCFError;

      RouteStore.push(route);

      routeActions.error(routeGuid, err);

      const actual = RouteStore.get(routeGuid);
      const expected = Object.assign({}, route, {
        error: err
      });

      expect(actual).toEqual(expected);
    });

    it('should emit change if errored route found', function() {
      const routeGuid = 'route-guid-zcvzxcv';
      const route = { guid: routeGuid };
      const err = testCFError;
      RouteStore.push(route);

      const spy = sandbox.spy(RouteStore, 'emitChange');

      routeActions.error('fake-guid', err);
      routeActions.error(routeGuid, err);
      routeActions.error(routeGuid, err);

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
