
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import orgActions from '../../../actions/org_actions.js';
import spaceActions from '../../../actions/space_actions.js';
import SpaceStore from '../../../stores/space_store.js';

describe('SpaceStore', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    SpaceStore._data = Immutable.List();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('constructor()', function() {
    it('should set _data to empty array', () => {
      expect(SpaceStore.getAll()).toBeEmptyArray();
    });
  });

  describe('on org actions org received', function() {
    it('should include the org guid in the space', function () {
      var spaceGuid = 'spaceGuid';
      var orgGuid = 'orgGuid';
      var org = {
        guid: orgGuid,
        spaces: [
          { guid: spaceGuid }
        ]
      };
      var expected = {
        guid: spaceGuid,
        org: orgGuid
      };

      orgActions.receivedOrg(org);

      expect(SpaceStore.getAll().pop()).toEqual(expected);
    });

    it('should merge the org spaces data in with any current spaces', function() {
      var orgGuid = 'adsfadzcxvzdfaew';
      var expectedSpace = { guid: 'adfadsbcvbqwrsdfadsf32' };
      var existingSpace = { guid: 'xczczxczczxcv2' };
      var org = {
        guid: orgGuid,
        spaces: [expectedSpace]
      };

      SpaceStore.push(existingSpace);
      orgActions.receivedOrg(org);

      expect(SpaceStore.getAll().length).toEqual(2);
      expect(SpaceStore.get(expectedSpace.guid).org).toEqual(orgGuid);
    });

    it('should emit a change event if there are spaces', function() {
      var spy = sandbox.spy(SpaceStore, 'emitChange');
      const testGuid = 'adfadsafdacxvx';

      orgActions.receivedOrg({ guid: testGuid, spaces: [{}]});
      orgActions.receivedOrg({ guid: testGuid });

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('on space actions space received', function() {
    it('should not emit a change event if data is the same', function() {
      let space = { guid: 'testSpaceGuid' };
      let spy = sandbox.spy(SpaceStore, 'emitChange');

      SpaceStore._data = Immutable.fromJS([space]);

      spaceActions.receivedSpace(space);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit a change event if new data is present', function () {
      let space = { guid: 'testSpaceGuid' };
      let spy = sandbox.spy(SpaceStore, 'emitChange');

      spaceActions.receivedSpace(space);

      expect(spy).toHaveBeenCalledOnce();
    })
  });
});
