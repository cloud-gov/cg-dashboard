
import '../../global_setup.js';

import http from 'axios';

import appActions from '../../../actions/app_actions.js';
import cfApi from '../../../util/cf_api.js';
import errorActions from '../../../actions/error_actions.js';
import loginActions from '../../../actions/login_actions.js';
import loginActionTypes from '../../../constants.js';
import orgActions from '../../../actions/org_actions.js';
import OrgStore from '../../../stores/org_store.js';
import spaceActions from '../../../actions/space_actions.js';
import serviceActions from '../../../actions/service_actions.js';
import userActions from '../../../actions/user_actions.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';

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
  var sandbox,
  errorFetchRes = { message: 'error' };

  beforeEach(() => {
    OrgStore._data = [];
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  function fetchErrorSetup() {
    var stub = sandbox.stub(http, 'get'),
        spy = sandbox.spy(errorActions, 'errorFetch'),
        expected = errorFetchRes;

    let testPromise = createPromise(true, expected);
    stub.returns(testPromise);
    
    return spy;
  };

  function assertFetchError(spy) {
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(errorFetchRes);
  }

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
      var spy = fetchErrorSetup();

      cfApi.fetchOrgs();

      assertFetchError(spy);
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
      var spy = fetchErrorSetup();

      cfApi.fetchSpace();

      assertFetchError(spy);
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
      var spy = fetchErrorSetup();

      cfApi.fetchServiceInstances();

      assertFetchError(spy);
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

    it('should call service deleted action with guid', function() {
      var stub = sandbox.stub(http, 'delete'),
          spy = sandbox.spy(serviceActions, 'deletedInstance'),
          expectedGuid = '38wofjasd',
          expected = { guid: expectedGuid, url: '/' + expectedGuid};

      let testPromise = createPromise({status: true});
      stub.returns(testPromise);

      cfApi.deleteUnboundServiceInstance(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toEqual(expectedGuid);
    });

    // TODO should be error action for non fetch errors.
  });

  describe('fetchApp()', function() {
    it('should call an http get request for app with app guid', function() {
      var spy = sandbox.spy(http, 'get'),
          expected = 'yyyybba1';

      cfApi.fetchApp(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
    });

    it('calls received action with app from response on success', function() {
      var expectedGuid = 'ttba',
          expected = { data: { guid: expectedGuid } },
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(appActions, 'receivedApp');

      let testPromise = createPromise(expected);

      stub.returns(testPromise);

      cfApi.fetchApp(expectedGuid);
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected.data);
    });

    it('calls errorActions fetch error on failure', () => {
      var spy = fetchErrorSetup();

      cfApi.fetchApp();

      assertFetchError(spy);
    });
  });

  describe('fetchSpaceUsers()', function() {
    it('should call an http get request for users with space guid', function() {
      var spy = sandbox.spy(http, 'get'),
          expected = 'adsfpjweqidalkvn';

      cfApi.fetchSpaceUsers(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
    });

    it('calls received action with users from response on success', function() {
      var expectedGuid = 'adsfkxcmz',
          expected = { data: { resources: wrapInRes([{ guid: expectedGuid }])}},
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(userActions, 'receivedSpaceUsers');

      let testPromise = createPromise(expected);

      stub.returns(testPromise);

      cfApi.fetchSpaceUsers('adsfas');
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected.data.resources);
    });

    it('calls errorActions fetch error on failure', () => {
      var spy = fetchErrorSetup();

      cfApi.fetchSpaceUsers();

      assertFetchError(spy);
    });
  });

  describe('fetchOrgUsers()', function() {
    it('should call an http get request for users with space guid', function() {
      var spy = sandbox.spy(http, 'get'),
          expected = 'adsfpjweqidalkvn';

      cfApi.fetchOrgUsers(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('organizations'));
      expect(actual).toMatch(new RegExp(expected));
    });

    it('calls received action with users from response on success', function() {
      var expectedGuid = 'adsfkxcmz',
          expected = { data: { resources: wrapInRes([{ guid: expectedGuid }])}},
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(userActions, 'receivedOrgUsers');

      let testPromise = createPromise(expected);

      stub.returns(testPromise);

      cfApi.fetchOrgUsers('adsfas');
      
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected.data.resources);
    });

    it('calls errorActions fetch error on failure', () => {
      var spy = fetchErrorSetup();

      cfApi.fetchOrgUsers();

      assertFetchError(spy);
    });
  });

  describe('deleteUser()', function() {
    it('should call a http delete request on the org and user', function() {
      var spy = sandbox.spy(http, 'delete'),
          expectedUserGuid = 'zvmxncznv-9u8qwphu',
          expectedOrgGuid = '0291kdvakjbdfvhp';

      cfApi.deleteUser(expectedUserGuid, expectedOrgGuid);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expectedUserGuid));
      expect(actual).toMatch(new RegExp(expectedOrgGuid));
    });

    it('should call org deleted action with guid', function() {
      var stub = sandbox.stub(http, 'delete'),
          spy = sandbox.spy(userActions, 'deletedUser'),
          expectedUserGuid = 'aldfskjmcx',
          expectedOrgGuid = 'sa09dvjakdnva';

      let testPromise = createPromise({status: true});
      stub.returns(testPromise);

      cfApi.deleteUser(expectedUserGuid, expectedOrgGuid);

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(expectedUserGuid);
      expect(args[1]).toEqual(expectedOrgGuid);
    });
  });

  describe('deleteOrgUserCategory()', function() {
    it('should call a http delete request on the org user with category ',
        function() {
      var spy = sandbox.spy(http, 'delete'),
          expectedUserGuid = 'zvmxncznv-9u8qwphu',
          expectedOrgGuid = '0291kdvakjbdfvhp',
          expectedCategory = 'some_role';

      cfApi.deleteOrgUserCategory(
        expectedUserGuid,
        expectedOrgGuid,
        expectedCategory);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expectedUserGuid));
      expect(actual).toMatch(new RegExp(expectedOrgGuid));
      expect(actual).toMatch(new RegExp(expectedCategory));
    });
  });

  describe('deleteOrgUserPermissions()', function() {
    it('should call an http delete request on org user with permissions',
        function() {
      var spy = sandbox.spy(http, 'delete'),
          expectedUserGuid = 'zvmxncznv-9u8qwphu',
          expectedOrgGuid = '0291kdvakjbdfvhp',
          expectedPermission = 'manager';

      cfApi.deleteOrgUserPermissions(
        expectedUserGuid,
        expectedOrgGuid,
        expectedPermission);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expectedUserGuid));
      expect(actual).toMatch(new RegExp(expectedOrgGuid));
      expect(actual).toMatch(new RegExp(expectedPermission));
    });

    it(`should call user action on a 400 response that has code 10006 with
        message about the error from cf`, function() {
      var stub = sandbox.stub(http, 'delete'),
          spy = sandbox.spy(userActions, 'errorRemoveUser'),
          expectedUserGuid = 'zcvmzxncbvpafd',
          expected = {
            code: 10006,
            description: 'Please delete the user associations for your spaces',
            error_code: 'CF-AssociationNotEmpty'
          };

      let testPromise = createPromise(true, { data: expected });
      stub.returns(testPromise);

      cfApi.deleteOrgUserPermissions(expectedUserGuid, 'asdf', 'role');

      expect(spy).toHaveBeenCalledOnce();
      let args = spy.getCall(0).args;
      expect(args[0]).toEqual(expectedUserGuid);
      expect(args[1]).toEqual(expected);
    });
  });

  describe('deleteOrgUserPermissions()', function() {
    it('should call an http put request on org user with permissions', function() {
      var spy = sandbox.spy(http, 'put'),
          expectedUserGuid = 'zvmxncznv-9u8qwphu',
          expectedOrgGuid = '0291kdvakjbdfvhp',
          expectedPermission = 'manager';

      cfApi.putOrgUserPermissions(
        expectedUserGuid,
        expectedOrgGuid,
        expectedPermission);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expectedUserGuid));
      expect(actual).toMatch(new RegExp(expectedOrgGuid));
      expect(actual).toMatch(new RegExp(expectedPermission));
    });
  });

  describe('fetchAllServices()', function() {
    it('should call http get request for services with org guid', function() {
      var spy = sandbox.spy(http, 'get'),
          expected = 'q98ahfxvjahfsdphu';

      cfApi.fetchAllServices(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('services'));
    });

    it('calls received action with services from response', function() {
      var expectedGuid = 'mzxlvkj',
          expected = { data: { resources: wrapInRes([{ guid: expectedGuid }])}},
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(serviceActions, 'receivedServices');

      let testPromise = createPromise(expected);

      stub.returns(testPromise);

      cfApi.fetchAllServices('alksdfj');
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected.data.resources);
    });
    
    it('calls errorActions fetch error on failure', function() {
      var spy = fetchErrorSetup();

      let actual = cfApi.fetchAllServices();

      assertFetchError(spy);
    });
  });

  describe('fetchAllServicePlans()', function() {
    it('should call http get request for service plans with service guid',
        function() {
      var spy = sandbox.spy(http, 'get'),
          expected = 'q98ahfxvjahfsdphu';

      cfApi.fetchAllServicePlans(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('service_plans'));
    });

    it('calls received action with services from response', function() {
      var expectedGuid = 'mzxlvkj',
          expected = { data: { resources: wrapInRes([{ guid: expectedGuid }])}},
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(serviceActions, 'receivedPlans');

      let testPromise = createPromise(expected);

      stub.returns(testPromise);

      cfApi.fetchAllServicePlans('alksdfj');
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected.data.resources);
    });
    
    it('calls errorActions fetch error on failure', function() {
      var spy = fetchErrorSetup();

      let actual = cfApi.fetchAllServicePlans();

      assertFetchError(spy);
    });
  });
});
