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
    let expectedGuid, viewSpy;

    beforeEach(function (done) {
      expectedGuid = 'adsfa';
      viewSpy = setupViewSpy(sandbox);
      sandbox.spy(cfApi, 'fetchOrg');
      sandbox.stub(orgActions, 'receivedOrg');

      // Avoid side-effects on the receive action
      sandbox.stub(AppDispatcher, 'handleServerAction');

      orgActions.fetch(expectedGuid).then(done, done.fail);
    });

    it('should dispatch a view event of type org fetch', () => {
      const expectedParams = {
        orgGuid: expectedGuid
      };

      assertAction(viewSpy, orgActionTypes.ORG_FETCH, expectedParams);
    });

    it('should call the api org fetch function', function () {
      expect(cfApi.fetchOrg).toHaveBeenCalledOnce();
      const [guid] = cfApi.fetchOrg.getCall(0).args;
      expect(guid).toBe(expectedGuid);
    });

    it('calls the receivedOrg action', function () {
      expect(orgActions.receivedOrg).toHaveBeenCalledOnce();
    });
  });

  describe('fetchAll()', function () {
    let viewSpy;

    beforeEach(function (done) {
      viewSpy = setupViewSpy(sandbox);
      sandbox.stub(orgActions, 'receivedOrgs').returns(Promise.resolve());
      sandbox.stub(cfApi, 'fetchOrgs').returns(Promise.resolve([{ guid: '1234' }]));
      sandbox.stub(cfApi, 'fetchOrgSummary').returns(Promise.resolve());

      orgActions.fetchAll().then(done, done.fail);
    });

    it('should dispatch a view event of type orgs fetch', function () {
      expect(viewSpy).toHaveBeenCalledWith(sinon.match({ type: orgActionTypes.ORGS_FETCH }));
    });

    it('calls receivedOrgs action', function () {
      expect(orgActions.receivedOrgs).toHaveBeenCalledOnce();
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
