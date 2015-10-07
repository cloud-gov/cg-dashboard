
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import OrgStore from '../../../stores/org_store.js';
import { orgActionTypes } from '../../../constants';

function wrapOrgs(orgs) {
  var n = 0;
  return orgs.map((org) => {
    return {
      metadata: { guid: n },
      entity: org
    };
    n++;
  });
};

function unwrapOrgs(orgs) {
  return orgs.map((org) => {
    return Object.assign(org.entity, org.metadata);
  });
}

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

  describe('on orgs received', () => {
    it('should set data to passed in orgs', () => {
      var expected = wrapOrgs([{t: 1}, {t: 2}]);
      expect(OrgStore.getAll()).toBeArray();

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_RECEIVED,
        orgs: expected
      });

      expect(OrgStore.getAll()).toEqual(unwrapOrgs(expected));
    });

    it('should emit a change event', () => {
      var spy = sandbox.spy(OrgStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_RECEIVED,
        orgs: []
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
