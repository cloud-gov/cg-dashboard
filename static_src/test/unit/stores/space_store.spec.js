
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
    it('should change fetching to false', function () {
      let space = { guid: 'testSpaceGuid' };

      SpaceStore.fetching = true;
      SpaceStore._data = Immutable.fromJS([space]);

      spaceActions.receivedSpace(space);

      expect(SpaceStore.fetching).toEqual(false);
    });
  });

  describe('on space change current', function() {
    it('should emit a change event', function() {
      const spaceGuid = 'zcxvadsjfcvbnm';
      const space = {
        guid: spaceGuid
      };
      let spy = sandbox.spy(SpaceStore, 'emitChange');

      spaceActions.changeCurrentSpace(spaceGuid);
      expect(spy).toHaveBeenCalledOnce();

      SpaceStore.push(space);
      spy.reset();
      spaceActions.changeCurrentSpace(spaceGuid);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should should change the current space to the passed in guid',
        function() {
      const spaceGuid = 'zcxvadsjfcvbnm';

      SpaceStore._currentSpaceGuid = 'adskfjxvb';

      spaceActions.changeCurrentSpace(spaceGuid);

      const actual = SpaceStore.currentSpaceGuid;

      expect(actual).toEqual(spaceGuid);
    });
  });

  describe('on space change current', function() {
    it('should emit a change event if space exists', function() {
      const spaceGuid = 'zcxvadsjfcvbnm';
      const space = {
        guid: spaceGuid
      };
      let spy = sandbox.spy(SpaceStore, 'emitChange');

      spaceActions.changeCurrentSpace(spaceGuid);
      expect(spy).not.toHaveBeenCalledOnce();

      SpaceStore.push(space);
      spy.reset();
      spaceActions.changeCurrentSpace(spaceGuid);
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should should change the current space to the passed in guid',
        function() {
      const spaceGuid = 'zcxvadsjfcvbnm';
      const space = {
        guid: spaceGuid
      };

      SpaceStore._currentSpaceGuid = 'adskfjxvb';
      SpaceStore.push(space);

      spaceActions.changeCurrentSpace(spaceGuid);

      const actual = SpaceStore.currentSpaceGuid;

      expect(actual).toEqual(spaceGuid);
    });
  });
});
