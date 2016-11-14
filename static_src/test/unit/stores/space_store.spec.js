
import '../../global_setup.js';

import Immutable from 'immutable';

import AppDispatcher from '../../../dispatcher.js';
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

  describe('on space actions all spaces received', function() {
    it('should call mergeMany with spaces from action', function () {
      const spy = sandbox.spy(SpaceStore, 'mergeMany');
      const spaces = [{ guid: 'fake-guid-one' }]
      const res = spaces;

      spaceActions.receivedSpaces(res);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy.getCall(0).args[1]).toEqual(spaces);
    });

    it('should emit a change event', function() {
      const spaces = [{ guid: 'fake-guid-one' }];
      const spy = sandbox.spy(SpaceStore, 'emitChange');

      spaceActions.receivedSpaces(spaces);

      expect(spy).toHaveBeenCalledOnce();
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

  describe('get currentSpaceName()', function() {
    it('should return emtpy string if no space', function() {
      const actual = SpaceStore.currentSpaceName;

      expect(actual).toEqual('');
    });

    it('should return space name if space', function() {
      const guid = 'zmn,vweiqodnjt7';
      const expected = 'spacename';
      const space = { guid: guid, name: expected };

      SpaceStore.push(space);
      SpaceStore._currentSpaceGuid = guid;

      const actual = SpaceStore.currentSpaceName;

      expect(actual).toEqual(expected);
    });
  });
});
