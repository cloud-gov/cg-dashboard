
import Immutable from 'immutable';

import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import ActivityStore from '../../../stores/activity_store.js';
import { activityActionTypes } from '../../../constants';

describe('ActivityStore', function() {
  var sandbox;

  beforeEach(() => {
    ActivityStore._data = Immutable.List();
    ActivityStore._fetching = false;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', function() {
    it('should start data as empty array', function() {
      expect(ActivityStore.getAll()).toBeEmptyArray();
    });
  });

  describe('on activity fetch', function () {
    it('should call cfApi.fetchSpaceEvents', function () {
      var spy = sandbox.spy(cfApi, 'fetchSpaceEvents');

      AppDispatcher.handleViewAction({
        type: activityActionTypes.ACTIVITY_FETCH,
        spaceGuid: 'fakeSpaceGuid'
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on activity received', function () {
    it('should merge activity and emit change', function () {
      const activity = [
        {
          guid: 'fakeActivityGuidOne',
          name: 'fakeActivityNameOne'
        },
        {
          guid: 'fakeActivityGuidTwo',
          name: 'fakeActivityNameTwo'
        }
      ];
      const spy = sandbox.spy(ActivityStore, 'emitChange');

      AppDispatcher.handleServerAction({
        type: activityActionTypes.ACTIVITY_RECEIVED,
        activity: wrapInRes(activity)
      });


      expect(ActivityStore.getAll()).toEqual(activity);
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
