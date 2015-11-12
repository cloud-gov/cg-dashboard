
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
});
