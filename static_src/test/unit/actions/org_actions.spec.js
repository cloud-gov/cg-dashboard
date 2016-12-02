import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupUISpy, setupViewSpy, setupServerSpy } from '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import orgActions from '../../../actions/org_actions.js';
import { orgActionTypes } from '../../../constants.js';

describe('orgActions', () => {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetch()', () => {
    it('should dispatch a view event of type org fetch', () => {
      var expected = 'adsfa',
          expectedParams = {
            orgGuid: expected
          };

      let spy = setupViewSpy(sandbox)

      orgActions.fetch(expected);

      assertAction(spy, orgActionTypes.ORG_FETCH, expectedParams);
    });
  });

  describe('fetchAll()', () => {
    it('should dispatch a view event of type orgs fetch', (done) => {
      var spy = setupViewSpy(sandbox)

      orgActions.fetchAll();

      setTimeout(() => {
        let arg = spy.getCall(0).args[0];
        expect(arg.type).toEqual(orgActionTypes.ORGS_FETCH);
        done();
      });
    });
  });

  describe('receivedOrg()', function() {
    it('should dispatch a server event for org fetch with the org', function() {
      var expected = { guid: 'asdf', name: 'adsfa' },
          expectedParams = {
            org: expected
          };

      let spy = setupServerSpy(sandbox)

      orgActions.receivedOrg(expected);

      assertAction(spy, orgActionTypes.ORG_RECEIVED, expectedParams);
    });
  });

  describe('changeCurrentOrg()', function() {
    it('should send an org change current event action with new org', function() {
      var expected = 'asdlfka',
          expectedParams = {
            orgGuid: expected
          };

      let spy = setupViewSpy(sandbox)

      orgActions.changeCurrentOrg(expected);

      assertAction(spy, orgActionTypes.ORG_CHANGE_CURRENT, expectedParams);
    });

    it('should send a space menu toggle UI action', function() {
      let expected = 'asdlfka';
      let spy = setupUISpy(sandbox)

      orgActions.toggleSpaceMenu(expected);

      assertAction(spy, orgActionTypes.ORG_TOGGLE_SPACE_MENU);
    });
  });

  describe('toggleQuicklook()', function() {
    it('should dispatch a UI event of type toggle quicklook', function() {
      const orgGuid = 'asdlfka';
      const expectedParams = {
        orgGuid
      };
      const spy = setupUISpy(sandbox);

      orgActions.toggleQuicklook(orgGuid);

      assertAction(spy, orgActionTypes.ORG_TOGGLE_QUICKLOOK);
    });
  });
});
