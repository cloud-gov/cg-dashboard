
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
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

  describe('get()', () => {
    it('should return the correct space based on guid', () => {
      var testSpaces = [
        { guid: 'sp1xxa', name: 'testSpaceA', apps: [] },
        { guid: 'sp1xxb', name: 'testSpaceB', apps: [] }
      ];

      SpaceStore._data = testSpaces;

      let actual = SpaceStore.get(testSpaces[0].guid);

      expect(actual).toEqual(testSpaces[0]);
    });
  });
});
