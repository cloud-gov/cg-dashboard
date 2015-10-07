
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import OrgStore from '../../../stores/org_store.js';
//import { orgActionTypes } from '../../../constants';

describe('OrgStore', () => {
  var sandbox;

  beforeEach(() => {
    OrgStore._data = [];
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set _data to empty array', () => {
      expect(OrgStore._data).toBeEmptyArray();
    });
  });

  describe('getAll()', () => {
    it('should return object when no state', () => {
      expect(OrgStore.getAll()).toBeArray();
    });
  });

  describe('get()', () => {
    it('should return the correct org based on guid', () => {
      var testOrgs = [
        { guid: '1xxa', name: 'testOrgA' },
        { guid: '1xxb', name: 'testOrgB' }
      ];

      OrgStore._data = testOrgs;

      let actual = OrgStore.get(testOrgs[0].guid);

      expect(actual).toEqual(testOrgs[0]);
    });
  });
});
