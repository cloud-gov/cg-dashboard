
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupUISpy, setupViewSpy, setupServerSpy } from '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import appActions from '../../../actions/app_actions.js';
import { appActionTypes } from '../../../constants.js';
import poll from '../../../util/poll.js';
import * as pollUtil from '../../../util/poll.js';

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
      var expectedAppGuid = 'asdflkjz',
          expectedParams = {
            appGuid: expectedAppGuid
          };

      let spy = setupViewSpy(sandbox)

      appActions.fetch(expectedAppGuid);

      assertAction(spy, appActionTypes.APP_FETCH,
                   expectedParams)
    });
  });

  describe('fetchAll()', function () {
    it('should dispatch a view event of type app all fetch', function() {
      const expectedAppGuid = 'asdflkjzzz1';
      const expectedParams = {
        appGuid: expectedAppGuid
      };

      const spy = setupViewSpy(sandbox);

      appActions.fetchAll(expectedAppGuid);

      assertAction(spy, appActionTypes.APP_ALL_FETCH, expectedParams);
    });
  });

  describe('fetchStats()', function() {
    it('should dispatch a view event of type app stats fetch', function() {
      var expectedAppGuid = 'asdflkjzzz1',
          expectedParams = {
            appGuid: expectedAppGuid
          };

      let spy = setupViewSpy(sandbox)

      appActions.fetchStats(expectedAppGuid);

      assertAction(spy, appActionTypes.APP_STATS_FETCH,
                   expectedParams)
    });
  });

  describe('receivedApp()', function() {
    it('should dispatch a server event of type app resv with app data',
        function() {
      var expected = { guid: 'asdfa', service: [] },
          expectedParams = {
            app: expected
          };

      let spy = setupServerSpy(sandbox)

      appActions.receivedApp(expected);

      assertAction(spy, appActionTypes.APP_RECEIVED,
                   expectedParams)
    });
  });

  describe('receivedAppStats()', function() {
    it('should dispatch a server event of type app stat resv with app data',
        function() {
      var expected = { guid: 'asdfazzzb', service: [] },
          expectedParams = {
            appGuid: expected.guid,
            app: expected
          };

      let spy = setupServerSpy(sandbox);

      appActions.receivedAppStats(expected.guid, expected);

      assertAction(spy, appActionTypes.APP_STATS_RECEIVED,
                   expectedParams)
    });
  });

  describe('receivedAppAll()', function() {
    it('should dispatch a server event of type app all received', function() {
      const appGuid = 'testingAppGuid';
      const spy = setupServerSpy(sandbox);

      appActions.receivedAppAll(appGuid);

      assertAction(spy, appActionTypes.APP_ALL_RECEIVED, {});
    });
  });

  describe('changeCurrentApp()', function() {
    it('should dispatch a ui event of type app changed with guid', function() {
      const appGuid = 'testingAppGuid';
      const expectedParams = {
        appGuid
      };
      const spy = setupUISpy(sandbox);

      appActions.changeCurrentApp(appGuid);

      assertAction(spy, appActionTypes.APP_CHANGE_CURRENT, {}, expectedParams);
    });
  });

  describe('updateApp()', function() {
    it('should dispatch a view event of type app update with partial and guid',
        function(done) {
      sandbox.stub(appActions, 'updatedApp').returns(Promise.resolve());
      sandbox.stub(cfApi, 'putApp').returns(Promise.resolve());
      const appGuid = 'zxc,vnadsfj';
      const appPartial = { mem: 123 };
      const expectedParams = {
        appGuid,
        appPartial
      };

      let spy = setupViewSpy(sandbox);

      appActions.updateApp(appGuid, appPartial).then(function() {
        assertAction(spy, appActionTypes.APP_UPDATE,
                     expectedParams)
        done();
      }).catch(done.fail);
    });

    it('should call cf api put app endpoint with guid and app partial',
        function(done) {
      const appGuid = 'zxc,vnadsfj';
      const appPartial = { mem: 123 };
      const spy = sandbox.stub(cfApi, 'putApp').returns(Promise.resolve());
      sandbox.stub(appActions, 'updatedApp').returns(Promise.resolve());

      appActions.updateApp(appGuid, appPartial).then(function() {
        expect(spy).toHaveBeenCalledOnce();
        let args = spy.getCall(0).args;
        expect(args[0]).toEqual(appGuid);
        expect(args[1]).toEqual(appPartial);
        done();
      }).catch(done.fail);
    });

    it('should call updated app action with app on success', function(done) {
      const spy = sandbox.stub(appActions, 'updatedApp').returns(Promise.resolve());
      const guid = '134ds3i4yzxvc';
      const expectedApp = { guid, mem: 1034 };
      sandbox.stub(cfApi, 'putApp').returns(Promise.resolve(expectedApp));

      appActions.updateApp(guid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(expectedApp);
        done();
      }).catch(done.fail);
    });
  });

  describe('start()', function() {
    it('should dispatch a view event of type app start with guid', function() {
      sandbox.stub(appActions, 'restarted').returns(Promise.resolve());
      sandbox.stub(cfApi, 'putApp').returns(Promise.resolve());
      const appGuid = 'zzcvxkadsf';
      const expectedParams = {
        appGuid
      };
      let spy = setupViewSpy(sandbox)

      appActions.start(appGuid);

      assertAction(spy, appActionTypes.APP_START, expectedParams);
    });

    it('should call cf api put app with state started to restart the app',
        function(done) {
      const spy = sandbox.stub(cfApi, 'putApp').returns(Promise.resolve());
      sandbox.stub(appActions, 'restarted').returns(Promise.resolve());
      const expectedGuid = 'asdfasd2vdamcdksa';

      appActions.start(expectedGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(expectedGuid);
        done();
      }).catch(done.fail);
    });

    it('should call restarted with guid on success of request', function(done) {
      const spy = sandbox.stub(appActions, 'restarted').returns(Promise.resolve());
      const expectedGuid = 'znxmcv23i4yzxvc';

      appActions.start(expectedGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(expectedGuid);
        done();
      }).catch(done.fail);
    });
  });

  describe('restart()', function() {
    it('should dispatch a view event of type app restart with guid', function() {
      const appGuid = 'zvmn3hkl';
      const expectedParams = {
        appGuid
      };
      let spy = setupViewSpy(sandbox)

      appActions.restart(appGuid);

      assertAction(spy, appActionTypes.APP_RESTART, expectedParams);
    });

    it('should call cf api post to restart the app', function() {
      const spy = sandbox.spy(cfApi, 'postAppRestart');
      const expectedGuid = 'asdfasd2vdamcdksa';

      appActions.restart(expectedGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedGuid);
    });
  });

  describe('restarted()', function() {
    it('should dispatch a server event of type app restarted', function() {
      const appGuid = '230894dgvk2r';
      const expectedParams = {
        appGuid
      };
      let spy = setupServerSpy(sandbox)

      appActions.restarted(appGuid);

      assertAction(spy, appActionTypes.APP_RESTARTED, expectedParams);
    });

    it('should poll until running instances is greater then 0', function() {
      const spy = sandbox.stub(pollUtil, 'default').returns(Promise.resolve());
      const expectedRes = {
        data: { running_instances: 1 }
      };

      appActions.restarted('zxlcvkjklv');

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toBeFunction();
      expect(args[0](expectedRes)).toBeTruthy();
      expect(args[1]).toBeFunction();
    });
  });

  describe('error()', function() {
    it('should dispatch server event of type app error', function() {
      const appGuid = '230894dzcxv234';
      const error = { status_code: 123 };
      const expectedParams = {
        appGuid,
        error
      };
      let spy = setupServerSpy(sandbox)

      appActions.error(appGuid, error);

      assertAction(spy, appActionTypes.APP_ERROR, expectedParams);
    });
  });
});
