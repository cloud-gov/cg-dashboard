
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import appActions from '../../../actions/app_actions.js';
import { appActionTypes } from '../../../constants.js';

describe('appActions', function() {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetch()', function() {
    it('should dispatch a view event of type app fetch', function() {
      var spy = sandbox.spy(AppDispatcher, 'handleViewAction'),
          expectedAppGuid = 'asdflkjz';

      appActions.fetch(expectedAppGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(appActionTypes.APP_FETCH);
      expect(arg.appGuid).toEqual(expectedAppGuid);
    });
  });

  describe('receivedApp()', function() {
    it('should dispatch a server event of type app resv with app data', 
        function() {
      var spy = sandbox.spy(AppDispatcher, 'handleServerAction'),
          expected = { guid: 'asdfa', service: [] };

      appActions.receivedApp(expected);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(appActionTypes.APP_RECEIVED);
      expect(arg.app).toEqual(expected);
    });
  });
});
