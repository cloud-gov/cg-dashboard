
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupViewSpy, setupServerSpy } from '../helpers.js';
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

  describe('fetchAllServices()', function() {
    it('should dispatch a view event of type service fetch', function() {
      let expectedParams = {
        orgGuid: 'adsfa'
      }
      let spy = setupViewSpy(sandbox)

      serviceActions.fetchAllServices(expectedParams.orgGuid);

      assertAction(spy, serviceActionTypes.SERVICES_FETCH, expectedParams);
    });
  });

  describe('receivedServices()', function() {
    it('should dispatch a view event of type service fetch', function() {
      var expected = [{ guid: 'adfzxcvz' }];
      let expectedParams = {
        services: expected
      }
      let spy = setupServerSpy(sandbox)

      serviceActions.receivedServices(expected);

      assertAction(spy, serviceActionTypes.SERVICES_RECEIVED, expectedParams);
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

  describe('receivedInstance()', function() {
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

  describe('deleteInstance()', function() {
    it('should dispatch a instance delete view event with instance guid', () => {
      var expectedInstanceGuid = 'asdfasdf';
      var expectedParams = {
        serviceInstanceGuid: expectedInstanceGuid
      }

      let spy = setupViewSpy(sandbox)
      serviceActions.deleteInstance(expectedInstanceGuid);

      assertAction(spy, serviceActionTypes.SERVICE_INSTANCE_DELETE,
                   expectedParams);
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
});
