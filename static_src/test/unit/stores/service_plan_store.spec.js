
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
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

  describe('getCost()', function() {
    it('should return 0 if any part of data is missing', function() {
      let serviceInstance = {};
      let actual = ServicePlanStore.getCost(serviceInstance);
      expect(actual).toEqual(0);

      serviceInstance = {
        extra: {}
      };
      actual = ServicePlanStore.getCost(serviceInstance);
      expect(actual).toEqual(0);

      serviceInstance = {
        extra: { costs: [{}]}
      };
      actual = ServicePlanStore.getCost(serviceInstance);
      expect(actual).toEqual(0);
    });

    it('should return number if found', function() {
      const cost = 10.23343;
      let serviceInstance = {
        extra: { costs: [{ amount: { usd: cost }}]}
      };
      let actual = ServicePlanStore.getCost(serviceInstance);
      expect(actual).toEqual(cost);
    });
  });

  describe('on service instances received', function() {
    const servicePlanGuid = 'zxkv,12398dajkh';
    const fakeInstances = [
      {
        metadata: {
          guid: 'zcvkzlxkcjvzxcz'
        },
        entity: {
          name: 'adfadsf',
          service_plan_guid: servicePlanGuid
        }
      }
    ];

    it('should set loading to true if there are instances', function() {
      serviceActions.receivedInstances(fakeInstances);
      expect(ServicePlanStore.loading).toEqual(true);
    });

    it('should emit a change', function() {
      const spy = sandbox.spy(ServicePlanStore, 'emitChange');
      serviceActions.receivedInstances(fakeInstances);

      // change will be called once on the event, again from the loading status
      expect(spy).toHaveBeenCalled();
    });

    it('should fetch service plans with each instance plan guid', function() {
      const spy = sandbox.spy(cfApi, 'fetchServicePlan');
      const servicePlanGuidA = 'zcxlxbnlk;adsjfkzcvx';
      const servicePlanGuidB = 'bzzcxvlkjzxcvldkzcvx';
      const serviceInstanceA = {
        metadata: {
          guid: 'adsfadcvzczxcvxvz'
        },
        entity: {
          service_plan_guid: servicePlanGuidA
        }
      };
      const serviceInstanceB = {
        metadata: {
          guid: 'adsfadcvb234zxva'
        },
        entity: {
          app_guid: "2a3820bb-febd-4c90-ab66-80faa4362142",
          service_plan_guid: servicePlanGuidB
        }
      }
      const serviceInstances = [serviceInstanceA, serviceInstanceB];

      serviceActions.receivedInstances(serviceInstances);

      expect(spy).toHaveBeenCalledTwice();

    });
  });

  describe('on services received', function() {
    it('should set loading to true', function() {
      const services = [{ guid: '3981f', name: 'adlfskzxcv' }];
      serviceActions.receivedServices(services);
      expect(ServicePlanStore.loading).toEqual(true);
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
  });

  describe('on service plans received', function() {
    it('should merge the passed in service plans to current data', function() {
      var expected = [
        { guid: 'zxvcjz', name: 'zxkjv' },
        { guid: '3981f', name: 'adlfskzxcv' }
      ];
      let existing = { guid: 'alkdjsfzxcv' };

      let testRes = expected;
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

      let testRes = [plan];

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
  });
});
