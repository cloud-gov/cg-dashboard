
import '../../global_setup.js';

import http from 'axios';

import cfApi from '../../../util/cf_api.js';
import errorActions from '../../../actions/error_actions.js';
import loginActions from '../../../actions/login_actions.js';
import loginActionTypes from '../../../constants.js';
import orgActions from '../../../actions/org_actions.js';
import OrgStore from '../../../stores/org_store.js';
import spaceActions from '../../../actions/space_actions.js';
import serviceActions from '../../../actions/service_actions.js';

function createPromise(res, err) {
  // TODO figure out how to do this with actual Promise object.
  return {
    then: function(cb, errCb) {
      if (!err) {
        cb(res);
      } else {
        errCb(err);
      }
    }
  }
};

describe('cfApi', function() {
  var sandbox;

  beforeEach(() => {
    OrgStore._data = [];
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAuthStatus()', function() {
    it('returns a promise', function() {
      var actual = cfApi.getAuthStatus();

      expect(actual.then).toBeTruthy();
    });

    it('calls http get request for auth status', () => {
      var spy = sandbox.spy(http, 'get');

      cfApi.getAuthStatus();

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch('authstatus');
    });

    it('calls received status with status on success', () => {
      var expectedStatus = 'logged_in',
          expected = { data: { status: expectedStatus } },
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(loginActions, 'receivedStatus');

      let testPromise = createPromise(expected);

      stub.returns(testPromise);

      cfApi.getAuthStatus();

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected.data.status);
    });

    it('calls received status with false on failure', () => {
      // Note: the getAuthStatus call will return 401 when not logged in, so
      // failure here means the user was likely not logged in. Although there
      // could be the additional problem that there was a problem with the req.
      var stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(loginActions, 'receivedStatus'),
          expected = { status: 'unauthorized' };

      let testPromise = createPromise(true, expected);
      stub.returns(testPromise);

      let actual = cfApi.getAuthStatus();

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('fetchOrg()', () => {
    it('returns a promise', () => {
      var actual = cfApi.fetchOrg('xxaa');

      expect(actual.then).toBeTruthy();
    });

    it('calls http get request 2 times for all data with guid', () => {
      var spy = sandbox.spy(http, 'get'),
          expected = 'xxxaa2';

      cfApi.fetchOrg(expected);

      let actual = spy.getCall(0).args[0];

      expect(spy).toHaveBeenCalledTwice();
      expect(actual).toMatch(new RegExp(expected));
    });

    it('calls received org action with response data on success', (done) => {
      var testRes = {
            guid: 'xxaa',
            name: 'testOrgA'
          },
          expected = { data: testRes },
          spy = sandbox.spy(orgActions, 'receivedOrg');

      sandbox.stub(cfApi, 'fetchOrgLinks').returns(
        createPromise({quota_definition_url: 'http://api.com'}));
      sandbox.stub(cfApi, 'fetchOrgDetails').returns(
        createPromise(expected))
      sandbox.stub(cfApi, 'fetchOrgMemoryUsage').returns(
        createPromise({memory_usage_in_mb: 10}));
      sandbox.stub(cfApi, 'fetchOrgMemoryLimit').returns(
        createPromise({memory_limit: 20}));

      let thing = cfApi.fetchOrg(testRes.guid);
      thing.then(function() {
        expect(spy).toHaveBeenCalledOnce();
        done(); 
      });
    });
  });

  describe('fetchOrgs()', function() {
    it('calls http get request for orgs', function() {
      var spy = sandbox.spy(http, 'get');

      cfApi.fetchOrgs();

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch('organizations');
    });

    it('calls orgs received with orgs on success', function() {
      var expectedOrgs = [
        { metadata: { guid: 'xxxaasdf' }, entity: { name: 'testA' }},
        { metadata: { guid: 'xxxaasdg' }, entity: { name: 'testB' }}
      ],
          expected = { data: { resources: expectedOrgs } },
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(orgActions, 'receivedOrgs');

      let testPromise = createPromise(expected);
      stub.returns(testPromise);

      let actual = cfApi.fetchOrgs();

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expectedOrgs);
    });

    it('calls error action with error on failure', function() {
      var stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(errorActions, 'errorFetch'),
          expected = { status: 'internal error' };

      let testPromise = createPromise(true, expected);

      stub.returns(testPromise);

      let actual = cfApi.fetchOrgs();

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected);
    });
  });

  describe('fetchOrgMemoryUsage()', function() {
    it('returns a promise', function() {
      var actual = cfApi.fetchOrgMemoryUsage();

      expect(actual.then).toBeTruthy();
    });

    it('calls http get request for orgs memory usage', function() {
      var spy = sandbox.spy(http, 'get'),
          expectedGuid = 'asdfad';

      cfApi.fetchOrgMemoryUsage(expectedGuid);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch('memory_usage');
      expect(actual).toMatch(expectedGuid);
    });
  });

  describe('fetchOrgMemoryLimit()', function() {
    it('returns a promise', function() {
      var testOrg = {quota_definition_url: 'http://api/quota_definitions'};
      var actual = cfApi.fetchOrgMemoryLimit(testOrg);

      expect(actual.then).toBeTruthy();
    });

    it('calls http get request for orgs memory usage', function() {
      var spy = sandbox.spy(http, 'get'),
          expectedGuid = 'asdfad',
          expectedOrg = {guid: expectedGuid, 
              quota_definition_url: 'http://api.gov/quota_definitions/' + 
                expectedGuid};

      cfApi.fetchOrgMemoryLimit(expectedOrg);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch('quota_definitions');
      expect(actual).toMatch(expectedGuid);
    });
  });

  describe('fetchSpace()', () => {
    it('calls http get request for space with guid', () => {
      var spy = sandbox.spy(http, 'get'),
          expected = 'yyyybba1';

      cfApi.fetchSpace(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
    });

    it('calls received action with space from response on success', () => {
      var expectedGuid = 'ttba',
          expected = { data: { guid: expectedGuid } },
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(spaceActions, 'receivedSpace');

      let testPromise = createPromise(expected);

      stub.returns(testPromise);

      cfApi.fetchSpace(expectedGuid);
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected.data);
    });

    it('calls errorActions fetch error on failure', () => {
      var stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(errorActions, 'errorFetch'),
          expected = { message: 'error' };

      let testPromise = createPromise(true, expected);

      stub.returns(testPromise);

      let actual = cfApi.fetchSpace();
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected);
    });
  });

  describe('fetchServiceInstances()', function() {
    it('calls http get request for service instance with space guid',
        function() {
      var spy = sandbox.spy(http, 'get'),
          expected = 'yyyybba1';

      cfApi.fetchServiceInstances(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
    });

    it('calls service action for received service instances with payload on ' +
       'success', function() {
      var expectedGuid = 'ttba',
          expected,
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(serviceActions, 'receivedInstances');

      expected = [
        { metadata: {
            guid: expectedGuid
          },
          entity: {
            type: 'someasdf'
          }
        }
      ];

      let testRes = {data: {resources: expected }};

      let testPromise = createPromise(testRes);
      stub.returns(testPromise);

      cfApi.fetchServiceInstances(expectedGuid);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected);
    });

    it('calls errorActions fetch error on failure', () => {
      var stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(errorActions, 'errorFetch'),
          expected = { message: 'error' };

      let testPromise = createPromise(true, expected);

      stub.returns(testPromise);

      let actual = cfApi.fetchServiceInstances();
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected);
    });
  });

  describe('deleteUnboundServiceInstance()', function() {
    it('should call http delete request on service route with service guid',
        function() {
      var spy = sandbox.spy(http, 'delete'),
          expectedGuid = 'yyasdflkjayybbaal1',
          expected = { guid: expectedGuid, url: '/'+ expectedGuid}

      cfApi.deleteUnboundServiceInstance(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expectedGuid));
    });

    it('should call service deleted action', function() {
      var stub = sandbox.stub(http, 'delete'),
          spy = sandbox.spy(serviceActions, 'deletedInstance');

      let testPromise = createPromise({status: true});
      stub.returns(testPromise);

      cfApi.deleteUnboundServiceInstance('vxmlks');

      expect(spy).toHaveBeenCalledOnce();
    });

    // TODO should be error action for non fetch errors.
  });
});
