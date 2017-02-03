
// Action to fetch a single service plan for the server.
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupViewSpy, setupServerSpy, setupUISpy } from
  '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';
import ServiceInstanceStore from '../../../stores/service_instance_store';
import { wrapInRes, unwrapOfRes } from '../helpers.js';

describe('serviceActions', function() {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchAllServices()', function () {
    let viewSpy, guid;

    beforeEach(function (done) {
      guid = 'asdfa';
      viewSpy = setupViewSpy(sandbox);
      sandbox.stub(cfApi, 'fetchAllServices').returns(Promise.resolve());

      serviceActions.fetchAllServices(guid).then(done, done.fail);
    });

    it('should dispatch a view event of type service fetch', function () {
      const expectedParams = {
        orgGuid: guid
      };

      assertAction(viewSpy, serviceActionTypes.SERVICES_FETCH, expectedParams);
    });

    it('calls cf_api fetchAllServices', function () {
      expect(cfApi.fetchAllServices).toHaveBeenCalledOnce();
    });
  });

  describe('receivedServices()', function() {
    it('should dispatch a view event of type service fetch', function() {
      var expected = [{ guid: 'adfzxcvz' }];
      let expectedParams = {
        services: wrapInRes(expected)
      }
      let spy = setupServerSpy(sandbox)

      serviceActions.receivedServices(wrapInRes(expected));

      assertAction(spy, serviceActionTypes.SERVICES_RECEIVED, expectedParams);
    });
  });

  describe('receivedPlan()', function() {
    it('should dispatch a server event with service plan', function() {
      const servicePlan = {
        metadata: {
          guid: 'xzclvkba328'
        },
        entity: {
          name: 'azcvb'
        }
      };
      const expectedParams = {
        servicePlan
      };

      let spy = setupServerSpy(sandbox)

      serviceActions.receivedPlan(servicePlan);

      assertAction(spy, serviceActionTypes.SERVICE_PLAN_RECEIVED,
                   expectedParams);
    });
  });

  describe('fetchAllPlans()', function() {
    it('should dispatch a view event with service guid', function() {
      var expectedGuid = 'admxzcg',
          expectedParams = {
            serviceGuid: expectedGuid
          };

      let spy = setupViewSpy(sandbox)

      serviceActions.fetchAllPlans(expectedGuid);

      assertAction(spy, serviceActionTypes.SERVICE_PLANS_FETCH,
                   expectedParams);
    });
  });

  describe('receivedPlans()', function() {
    it('should dispatch a server event for received service plans with the plans',
        function() {
      var expectedServices = [{ guid: 'asdf', name: 'plan' }],
          expectedParams = {
            servicePlans: wrapInRes(expectedServices)
          };

      let spy = setupServerSpy(sandbox)

      serviceActions.receivedPlans(wrapInRes(expectedServices));

      assertAction(spy, serviceActionTypes.SERVICE_PLANS_RECEIVED,
                   expectedParams);
    });
  });

  describe('fetchInstance()', function() {
    it('should dispatch a view event of type service instance fetch', function() {
      var expectedSpaceGuid = 'aksfdsaaa8899';

      let expectedParams = {
        spaceGuid: expectedSpaceGuid
      }

      let spy = setupViewSpy(sandbox)

      serviceActions.fetchAllInstances(expectedSpaceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCES_FETCH,
                   expectedParams)
    });
  });

  describe('createInstanceForm()', function() {
    it(`should dispatch a view event of type create instance form with the
        service guid and service plan guid`, function() {
      var expectedServiceGuid = 'wqphjhajkajkhadjhfd',
          expectedServicePlanGuid = 'fp2ajkdsfadgh32fasd';

      let expectedParams = {
        servicePlanGuid: expectedServicePlanGuid,
        serviceGuid: expectedServiceGuid
      };
      let spy = setupViewSpy(sandbox);

      serviceActions.createInstanceForm(expectedServiceGuid,
        expectedServicePlanGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM,
                   expectedParams);
    });
  });

  describe('createInstanceFormCancel', function() {
    it('should dispatch a ui event of type create service instance form cancel',
        function() {
      let spy = setupUISpy(sandbox);

      serviceActions.createInstanceFormCancel();

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CREATE_FORM_CANCEL,
        {});
    });
  });

  describe('createInstance()', function() {
    it(`should dispatch a view event of type service instance create with name
        space guid, and service plan guid`, function() {
      var expectedSpaceGuid = 'alksjdfvcbxzzz',
          expectedName = 'service',
          expectedServicePlanGuid = '78900987adfasda';

      let expectedParams = {
        name: expectedName,
        spaceGuid: expectedSpaceGuid,
        servicePlanGuid: expectedServicePlanGuid
      };
      let spy = setupViewSpy(sandbox);

      serviceActions.createInstance(
          expectedName,
          expectedSpaceGuid,
          expectedServicePlanGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CREATE,
                   expectedParams);
    });
  });

  describe('createdInstance()', function() {
    it('should dispatch a server event of type instance created with service',
        function() {
      var expectedInstance = { guid: 'asdfas' };

      let expectedParams = {
        serviceInstance: expectedInstance
      };
      let spy = setupServerSpy(sandbox);

      serviceActions.createdInstance(expectedInstance);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CREATED,
                   expectedParams);
    });
  });

  describe('errorCreateInstance()', function() {
    it('should dispatch a server event of type error create instance', function() {
      var expectedErr = { status: 400 };

      let expectedParams = {
        error: expectedErr
      }
      let spy = setupServerSpy(sandbox);

      serviceActions.errorCreateInstance(expectedErr);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CREATE_ERROR,
                   expectedParams);
    });
  });

  describe('receivedInstance()', function() {
    it('should dispatch a server event of type service instance resv with ' +
       'the service instance', function() {
      const expected = {
        metadata: {
          guid: 'afds'
        },
        entity: {
          type: 'someasdf'
        }
      };

      let expectedParams = {
        serviceInstance: expected
      }

      let spy = setupServerSpy(sandbox)

      serviceActions.receivedInstance(expected);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_RECEIVED,
                   expectedParams);
    });
  });

  describe('receivedInstances()', function() {
    it('should dispatch a server event of type service instance resv with ' +
       'the service instances', function() {
      var expected = [
        { metadata: {
            guid: 'afds'
          },
          entity: {
            type: 'someasdf'
          }
        }
      ];

      let expectedParams = {
        serviceInstances: expected
      }

      let spy = setupServerSpy(sandbox)

      serviceActions.receivedInstances(expected);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCES_RECEIVED,
                   expectedParams);
    });
  });

  describe('deleteInstanceConfirm()', function() {
    it('should dispatch a instance delete confirm ui event with instance guid',
       () => {
      var expectedInstanceGuid = '09zxcn1dsf';
      var expectedParams = {
        serviceInstanceGuid: expectedInstanceGuid
      }

      let spy = setupUISpy(sandbox)
      serviceActions.deleteInstanceConfirm(expectedInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_DELETE_CONFIRM,
                   expectedParams);
    });
  });

  describe('deleteInstanceCancel()', function() {
    it('should dispatch a instance delete cancel ui event with instance guid',
       () => {
      var expectedInstanceGuid = '23098znxb';
      var expectedParams = {
        serviceInstanceGuid: expectedInstanceGuid
      }

      let spy = setupUISpy(sandbox)
      serviceActions.deleteInstanceCancel(expectedInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_DELETE_CANCEL,
                   expectedParams);
    });
  });

  describe('deleteInstance()', function () {
    let expectedInstanceGuid, expected, viewSpy;

    beforeEach(function (done) {
      expectedInstanceGuid = 'asdfasdf';
      expected = { guid: expectedInstanceGuid, url: `/${expectedInstanceGuid}` };

      viewSpy = setupViewSpy(sandbox);
      sandbox.stub(cfApi, 'deleteUnboundServiceInstance').returns(Promise.resolve());

      // TODO this should be a fresh instance of ServiceInstanceStore, but the
      // actions use the global singletons
      ServiceInstanceStore.clear();
      ServiceInstanceStore.push(expected);

      serviceActions.deleteInstance(expectedInstanceGuid).then(done, done.fail);
    });

    it('should dispatch a instance delete view event with instance guid', () => {
      const expectedParams = {
        serviceInstanceGuid: expectedInstanceGuid
      };

      assertAction(viewSpy, serviceActionTypes.SERVICE_INSTANCE_DELETE, expectedParams);
    });

    it('should call api delete with the service', function () {
      expect(cfApi.deleteUnboundServiceInstance).toHaveBeenCalledOnce();
      const arg = cfApi.deleteUnboundServiceInstance.getCall(0).args[0];
      expect(arg).toEqual(expected);
    });

    describe('for non existing instance', function () {
      it('should do nothing if the service isn\'t in data', function () {
        cfApi.deleteUnboundServiceInstance.reset();
        serviceActions.deleteInstance('1234');
        expect(cfApi.deleteUnboundServiceInstance).not.toHaveBeenCalled();
      });
    });
  });

  describe('deletedInstance()', function() {
    // TODO create test case to simulate failed delete attempt.
    it('should dispatch a instance deleted server event with guid', function() {
      var expectedGuid = 'admxzcg',
          expectedParams = {
            serviceInstanceGuid: expectedGuid
          };

      let spy = setupServerSpy(sandbox)

      serviceActions.deletedInstance(expectedGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_DELETED,
                   expectedParams);
    });
  });

  describe('changeServiceInstanceCheck()', function() {
    it('should dispatch a instance change check ui action with guid', function() {
      const serviceInstanceGuid = 'aldkjsf39287';
      const expectedParams = {
        serviceInstanceGuid
      };

      const spy = setupUISpy(sandbox);

      serviceActions.changeServiceInstanceCheck(serviceInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CHANGE_CHECK,
                   expectedParams);
    });
  });

  describe('changeServiceInstanceCancel()', function() {
    it('should dispatch a instance change cancel ui action with guid', function() {
      const serviceInstanceGuid = 'aldkjsfxcvg4';
      const expectedParams = {
        serviceInstanceGuid
      };

      const spy = setupUISpy(sandbox);

      serviceActions.changeServiceInstanceCancel(serviceInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_CHANGE_CANCEL,
                   expectedParams);
    });
  });

  describe('fetchServiceBindings()', function() {
    it('should dispatch service bindings fetch view event with app guid',
        function() {
      const appGuid = 'aldkjfs';
      const expectedParams = {
        appGuid
      };
      const spy = setupViewSpy(sandbox)

      serviceActions.fetchServiceBindings(appGuid);

      assertAction(spy, serviceActionTypes.SERVICE_BINDINGS_FETCH,
                   expectedParams);
    });
  });

  describe('receivedServiceBindings()', function() {
    it('should dispatch service bindings resv server event with binding',
        function() {
      const bindings = [{ metadata: { guid: 'zcxbz' } }];
      const expectedParams = {
        serviceBindings: bindings
      };
      const spy = setupServerSpy(sandbox)

      serviceActions.receivedServiceBindings(bindings);

      assertAction(spy, serviceActionTypes.SERVICE_BINDINGS_RECEIVED,
                   expectedParams);
    });
  });

  describe('bindService()', function() {
    it('should dispatch a service bind view event with app guid and instance guid',
        function() {
      const appGuid = 'asldfjzzcxv';
      const serviceInstanceGuid = 'zxclkjvzdfadfadsfasdfad';
      const expectedParams = {
        appGuid,
        serviceInstanceGuid
      };

      const spy = setupViewSpy(sandbox);

      serviceActions.bindService(appGuid, serviceInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_BIND, expectedParams);
    });
  });

  describe('unbindService()', function() {
    it('should dispatch a service unbind view event with binding', function() {
      const binding = {
        service_instance_guid: 'asladsfdfjzzcxv',
        app_guid: '12346vzdfadfadsfasdfad'
      };
      const expectedParams = {
        serviceBinding: binding
      };

      const spy = setupViewSpy(sandbox);

      serviceActions.unbindService(binding);

      assertAction(spy, serviceActionTypes.SERVICE_UNBIND, expectedParams);
    });

  });

  describe('boundService()', function() {
    it('should dispatch a service bound server event with binding',
        function() {
      const appGuid = '198fjzzcxv';
      const instanceGuid = '47kjvzdfadfadsfasdfad';
      const binding = {
        service_instance_guid: instanceGuid,
        app_guid: appGuid
      };
      const expectedParams = {
        serviceBinding: binding
      };

      const spy = setupServerSpy(sandbox);

      serviceActions.boundService(binding);

      assertAction(spy, serviceActionTypes.SERVICE_BOUND, expectedParams);
    });
  });

  describe('unboundService()', function() {
    it('should dispatch a service unbound server event with binding',
        function() {
      const appGuid = '198fjzzcxv';
      const instanceGuid = '47kjvzdfadfadsfasdfad';
      const binding = {
        service_instance_guid: instanceGuid,
        app_guid: appGuid
      };
      const expectedParams = {
        serviceBinding: binding
      };

      const spy = setupServerSpy(sandbox);

      serviceActions.unboundService(binding);

      assertAction(spy, serviceActionTypes.SERVICE_UNBOUND, expectedParams);
    });
  });

  describe('instanceError()', function() {
    it('should dispatch a server event of service instance error', function() {
      const instanceGuid = 'adfzcvb2cvb435n';
      const err = { status: 500, data: { }};
      const params = {
        serviceInstanceGuid: instanceGuid,
        error: err
      };
      const spy = setupServerSpy(sandbox);

      serviceActions.instanceError(instanceGuid, err)

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_ERROR, params);
    });
  });
});
