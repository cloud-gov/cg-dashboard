
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import ServicePlanStore from '../../../stores/service_plan_store.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';

describe('ServicePlanStore', function() {
  var sandbox;

  beforeEach(() => {
    ServicePlanStore._data = Immutable.List();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set _data to empty array', () => {
      expect(ServicePlanStore.getAll()).toBeEmptyArray();
    });
  });

  describe('getAllFromService()', function() {
    it('should only return servicePlans with the correct service guid',
        function() {
      var expectedServiceGuid = 'alkdsfjxcvzmcnvqsdxf';
      let expectedServices = [
        { service_guid: expectedServiceGuid, guid: 'zvcxklz' },
        { service_guid: expectedServiceGuid, guid: 'zcvzcxvzzv' }
      ];
      let unexpectedService = { service_guid: 'zxklcjv', guid: 'qwpoerui' };

      ServicePlanStore._data = Immutable.fromJS(expectedServices);
      ServicePlanStore.push(unexpectedService);

      let actual = ServicePlanStore.getAllFromService(expectedServiceGuid);

      expect(actual.length).toEqual(2);
      expect(actual).toEqual(expectedServices);
    });

  });

  describe('on services received', function() {
    it('should set fetching to true', function() {
      const services = wrapInRes([{ guid: '3981f', name: 'adlfskzxcv' }]);
      ServicePlanStore.fetching = false;
      serviceActions.receivedServices(services);
      expect(ServicePlanStore.fetching).toEqual(true);
    });
  });

  describe('on service plans fetch', function() {
    it('should call the cf api for all service plans belonging to the service',
        function() {
      var spy = sandbox.spy(cfApi, 'fetchAllServicePlans'),
          expectedServiceGuid = 'zxncvz8xcvhn32';

      serviceActions.fetchAllPlans(expectedServiceGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedServiceGuid);
    });

    it('should set fetching to true', function() {
      ServicePlanStore.fetching = false;
      serviceActions.fetchAllPlans('zxncvz8xcvhn32');
      expect(ServicePlanStore.fetching).toEqual(true);
    });
  });

  describe('on service plans received', function() {
    it('should merge the passed in service plans to current data', function() {
      var expected = [
        { guid: 'zxvcjz', name: 'zxkjv' },
        { guid: '3981f', name: 'adlfskzxcv' }
      ];
      let existing = { guid: 'alkdjsfzxcv' };

      let testRes = wrapInRes(expected);
      ServicePlanStore.push(existing);

      serviceActions.receivedPlans(testRes);

      let actual = ServicePlanStore.getAll();

      expect(actual.length).toEqual(3);
      actual = ServicePlanStore.get(expected[0].guid);
      expect(actual).toEqual(expected[0]);
    });

    it('should parse out the JSON in extra field', function() {
      var expected = { amount: { usd: 0.1 }},
          expectedGuid = 'adslkjfzcxv';

      let plan = {
        guid: expectedGuid,
        extra: JSON.stringify(expected)
      };

      let testRes = wrapInRes([plan]);

      serviceActions.receivedPlans(testRes);

      let actual = ServicePlanStore.get(expectedGuid);

      expect(actual).toBeTruthy();
      expect(actual.guid).toEqual(expectedGuid);
      expect(actual.extra).toEqual(expected);
    });

    it('should do nothing if there are no service plans', function() {
      var spy = sandbox.spy(ServicePlanStore, 'emitChange');

      ServicePlanStore._data = Immutable.fromJS([{ guid: 'adsfklj'}]);

      serviceActions.receivedPlans();

      expect(spy).not.toHaveBeenCalled();
      expect(ServicePlanStore.getAll().length).toEqual(1);
    });

    it('should set fetching to false', function() {
      ServicePlanStore.fetching = true;
      serviceActions.receivedPlans(wrapInRes([{ guid: 'adfklj' }]));

      expect(ServicePlanStore.fetching).toEqual(false);
    });
  });
});
