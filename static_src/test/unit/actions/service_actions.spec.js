
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
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

  describe('fetchInstance()', function() {
    it('should dispatch a view event of type service instance fetch', function() {
      var spy = sandbox.spy(AppDispatcher, 'handleViewAction'),
          expectedSpaceGuid = 'aksfdsaaa8899';

      serviceActions.fetchAllInstances(expectedSpaceGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(serviceActionTypes.SERVICE_INSTANCES_FETCH);
      expect(arg.spaceGuid).toEqual(expectedSpaceGuid);
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
      expect(arg.spaceGuid).toEqual(expectedInstanceGuid);

    });
  });
});
