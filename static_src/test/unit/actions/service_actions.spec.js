
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction } from '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import serviceActions from '../../../actions/service_actions.js';
import { serviceActionTypes } from '../../../constants.js';

describe('serviceActions', function() {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  function setupViewSpy() {
    return sandbox.spy(AppDispatcher, 'handleViewAction');
  }
  function setupServerSpy() {
    return sandbox.spy(AppDispatcher, 'handleServerAction');
  }

  describe('fetchAllServices()', function() {
    it('should dispatch a view event of type service fetch', function() {
      let expectedParams = {
        orgGuid: 'adsfa'
      }
      let spy = setupViewSpy()

      serviceActions.fetchAllServices(expectedParams.orgGuid);

      assertAction(spy, serviceActionTypes.SERVICES_FETCH, expectedParams);
    });
  });

  describe('fetchInstance()', function() {
    it('should dispatch a view event of type service instance fetch', function() {
      var expectedSpaceGuid = 'aksfdsaaa8899';

      let expectedParams = {
        spaceGuid: expectedSpaceGuid 
      }

      let spy = setupViewSpy()

      serviceActions.fetchAllInstances(expectedSpaceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCES_FETCH, 
                   expectedParams)
    });
  });

  describe('receivedInstance()', function() {
    it('should dispatch a server event of type service instance resv with ' +
       'the service instances', function() {
      var expected,
          expectedGuid,
          spy = sandbox.spy(AppDispatcher, 'handleServerAction');

      expected = [
        { metadata: {
            guid: expectedGuid
          },
          entity: {
            type: 'someasdf'
          }
        }
      ];

      serviceActions.receivedInstances(expected);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(serviceActionTypes.SERVICE_INSTANCES_RECEIVED);
      expect(arg.serviceInstances).toEqual(expected);
    });
  });

  describe('deleteInstance()', function() {
    it('should dispatch a instance delete view event with instance guid', () => {
      var spy = sandbox.spy(AppDispatcher, 'handleViewAction'),
          expectedInstanceGuid = '0sd9fajdmz';

      serviceActions.deleteInstance(expectedInstanceGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(serviceActionTypes.SERVICE_INSTANCE_DELETE);
      expect(arg.serviceInstanceGuid).toEqual(expectedInstanceGuid);
    });
  });

  describe('deletedInstance()', function() {
    // TODO create test case to simulate failed delete attempt.
    it('should dispatch a instance deleted server event with guid', function() {
      var spy = sandbox.spy(AppDispatcher, 'handleServerAction'),
          expectedGuid = 'admxzcg';

      serviceActions.deletedInstance(expectedGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(serviceActionTypes.SERVICE_INSTANCE_DELETED);
      expect(arg.serviceInstanceGuid).toEqual(expectedGuid);
    });
  });
});
