
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import orgActions from '../../../actions/org_actions.js';
import SpaceStore from '../../../stores/space_store.js';
import { spaceActionTypes } from '../../../constants';

describe('SpaceStore', () => {
  var sandbox;

  beforeEach(() => {
    SpaceStore._data = [];
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set _data to empty array', () => {
      expect(SpaceStore._data).toBeEmptyArray();
    });
  });

  describe('on org actions org received', function() {
    it('should merge the org spaces data in with any current spaces', function() {
      var expectedSpace = { guid: 'adfadsbcvbqwrsdfadsf32' },
          existingSpace = { guid: 'xczczxczczxcv2' };
      var org = {
        guid: 'adsfadzcxvzdfaew',
        spaces: [expectedSpace]
      };

      SpaceStore._data.push(existingSpace);
      orgActions.receivedOrg(org);

      expect(SpaceStore.getAll().length).toEqual(2);
      expect(SpaceStore.get(expectedSpace.guid)).toEqual(expectedSpace);
    });

    it('should emit a change event if there are spaces', function() {
      var spy = sandbox.spy(SpaceStore, 'emitChange');

      orgActions.receivedOrg({ guid: 'adfadsafdacxvx', spaces: [{}]});
      orgActions.receivedOrg({ guid: 'adfadsafdacxvx'});

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
