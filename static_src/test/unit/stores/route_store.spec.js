
import Immutable from 'immutable';

import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import RouteStore from '../../../stores/route_store.js';
import { routeActionTypes } from '../../../constants';

describe('RouteStore', function() {
  var sandbox;

  beforeEach(() => {
    RouteStore._data = Immutable.List();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', function() {
    it('should start data as empty array', function() {
      expect(RouteStore.getAll()).toBeEmptyArray();
    });
  });

  describe('on route for app fetch', function() {
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

  describe('on route for app received', function() {
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
        Object.assign({}, routeA, { appGuid: sharedGuid }));
    });

    it('should merge all the routes in', function() {
      const sharedGuid = 'zxcb234nvc654ad';
      const spy = sandbox.spy(RouteStore, 'mergeMany');
      const existingRoute = { guid: 'zxcb', appGuid: sharedGuid };

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
  });
});
