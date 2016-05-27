
import '../../global_setup.js';

import http from 'axios';
import Immutable from 'immutable';

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
  if (!err) {
    return Promise.resolve(res);
  } else {
    return Promise.reject(err);
  }
};

describe('cfApi', function() {
  var sandbox,
      errorFetchRes = { message: 'error' };

  beforeEach(() => {
    OrgStore._data = new Immutable.List();
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

  describe('fetchOne()', function() {
    it('should call an http get request with the versioned url', function() {
      var stub = sandbox.stub(http, 'get'),
          expectedUrl = '/org/asldfkj';

      let testPromise = createPromise({data: {}});
      stub.returns(testPromise);

      cfApi.fetchOne(expectedUrl, function() { });

      expect(stub).toHaveBeenCalledOnce();
      let actual = stub.getCall(0).args[0];
      expect(actual).toEqual(cfApi.version + expectedUrl);
    });

    it('should call the action with the response data on success',
        function(done) {
      var expected = { data: { guid: 'q39g08hgdih' }},
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy();

      let testPromise = createPromise(expected);
      stub.returns(testPromise);

      cfApi.fetchOne('/thing/adjfk', spy).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toEqual(expected.data);
        done();
      });;
    });

    it('should call the fetch error action on failure', function(done) {
      var spy = fetchErrorSetup();

      cfApi.fetchOne().then(() => {
        assertFetchError(spy);
        done();
      });
    });

    it('should pass any additional arguments to the action', function(done) {
      var spy = sandbox.spy(),
          stub = sandbox.stub(http, 'get'),
          expectedArgA = 'arga',
          expectedArgB = 'argb';

      let testPromise = createPromise('asdf');
      stub.returns(testPromise);
      cfApi.fetchOne('/thing/asdfz', spy, expectedArgA, expectedArgB).then(() => {
        let actual = spy.getCall(0).args[1];
        expect(actual).toEqual(expectedArgA);
        actual = spy.getCall(0).args[2];
        expect(actual).toEqual(expectedArgB);
        done();
      });;
    });
  });

  describe('getAuthStatus()', function() {
    it('calls http get request for auth status', (done) => {
      var spy = sandbox.spy(http, 'get');

      cfApi.getAuthStatus().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toMatch('authstatus');
        done();
      });
    });

    it('calls received status with status on success', (done) => {
      var expectedStatus = 'logged_in',
          expected = { data: { status: expectedStatus } },
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(loginActions, 'receivedStatus');

      let testPromise = createPromise(expected);

      stub.returns(testPromise);

      cfApi.getAuthStatus().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(expected.data.status);
        done();
      });;
    });

    it('calls received status with false on failure', (done) => {
      // Note: the getAuthStatus call will return 401 when not logged in, so
      // failure here means the user was likely not logged in. Although there
      // could be the additional problem that there was a problem with the req.
      var stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(loginActions, 'receivedStatus'),
          expected = { status: 'unauthorized' };

      let testPromise = createPromise(true, expected);
      stub.returns(testPromise);

      let actual = cfApi.getAuthStatus().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(false);
        done();
      });
    });
  });

  describe('fetchOrg()', () => {
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
    it('calls http get request for orgs', function(done) {
      var spy = sandbox.spy(http, 'get');

      cfApi.fetchOrgs().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toMatch('organizations');
        done();
      });;

    });

    it('calls orgs received with orgs on success', function(done) {
      var expectedOrgs = [
        { metadata: { guid: 'xxxaasdf' }, entity: { name: 'testA' }},
        { metadata: { guid: 'xxxaasdg' }, entity: { name: 'testB' }}
      ],
          expected = { data: { resources: expectedOrgs } },
          stub = sandbox.stub(http, 'get'),
          spy = sandbox.spy(orgActions, 'receivedOrgs');

      let testPromise = createPromise(expected);
      stub.returns(testPromise);

      let actual = cfApi.fetchOrgs().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(expectedOrgs);
        done();
      });;

    });

    it('calls error action with error on failure', function(done) {
      var spy = fetchErrorSetup();

      cfApi.fetchOrgs().then(() => {
        assertFetchError(spy);
        done();
      });
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
    it('calls fetch one for space with guid and received space', function() {
      var expected = 'yyyybba1',
          spy = sandbox.stub(cfApi, 'fetchOne');

      cfApi.fetchSpace(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('space'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(spaceActions.receivedSpace);
    });
  });

  describe('fetchServiceInstances()', function() {
    it('should call fetch with spaces service instances url and recevied space',
        function() {
      var expected = 'yyyybba1',
          spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchServiceInstances(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('spaces'));
      expect(actual).toMatch(new RegExp('service_instances'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(serviceActions.receivedInstances);
    });
  });

  describe('createServiceInstance()', function() {
    var expectedName = 'name',
        expectedSpaceGuid = 'vzjck8zv9czjck',
        expectedServicePlanGuid = 'vcmn234adf';

    it('should call an http create for service_instance url and payload',
        function() {
      var expectedName = 'nameA',
          expectedSpaceGuid = 'adjszc98bv7zxcf',
          expectedServicePlanGuid = 'aldkfjbnzx1231',
          spy = sandbox.spy(http, 'post');

      let expected = {
        name: expectedName,
        space_guid: expectedSpaceGuid,
        service_plan_guid: expectedServicePlanGuid
      };

      cfApi.createServiceInstance(
          expectedName,
          expectedSpaceGuid,
          expectedServicePlanGuid);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('service_instances'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(expected);
    });

    it('should add an accepts_incomplete param in the request', function() {
      var spy = sandbox.spy(http, 'post');

      cfApi.createServiceInstance(
          expectedName,
          expectedSpaceGuid,
          expectedServicePlanGuid);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('accepts_incomplete'));
    });

    it('should call service action for instance created on success',
        function(done) {
      var stub = sandbox.stub(http, 'post'),
          spy = sandbox.spy(serviceActions, 'createdInstance'),
          expected = { data: { guid: 'znvmjahskf' }};

      let testPromise = createPromise(expected);
      stub.returns(testPromise);

      cfApi.createServiceInstance(
          expectedName,
          expectedSpaceGuid,
          expectedServicePlanGuid).then(() => {
            expect(spy).toHaveBeenCalledOnce();
            let actual = spy.getCall(0).args[0];
            expect(actual).toEqual(expected.data);
            done();
          });
    });

    it('should call an service error action on failure', function(done) {
      var stub = sandbox.stub(http, 'post'),
          spy = sandbox.stub(serviceActions, 'errorCreateInstance'),
          expectedErr = { status: 'error' };

      let testPromise = createPromise(true, {data: expectedErr});
      stub.returns(testPromise);

      cfApi.createServiceInstance(
          expectedName,
          expectedSpaceGuid,
          expectedServicePlanGuid).then(() => {
            expect(spy).toHaveBeenCalledOnce();
            let actual = spy.getCall(0).args[0];
            expect(actual).toEqual(expectedErr);
            done();
        });
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

    it('should call service deleted action with guid', function(done) {
      var stub = sandbox.stub(http, 'delete'),
          spy = sandbox.spy(serviceActions, 'deletedInstance'),
          expectedGuid = '38wofjasd',
          expected = { guid: expectedGuid, url: '/' + expectedGuid};

      let testPromise = createPromise({status: true});
      stub.returns(testPromise);

      cfApi.deleteUnboundServiceInstance(expected).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toEqual(expectedGuid);
        done();
      });
    });

    // TODO should be error action for non fetch errors.
  });

  describe('fetchApp()', function() {
    it('should call fetch with apps url and received app space', function() {
      var expected = 'yyyybba1',
          spy = sandbox.stub(cfApi, 'fetchOne');

      cfApi.fetchApp(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('apps'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(appActions.receivedApp);
    });
  });

  describe('fetchAppStats()', function() {
    it('should call fetch with apps url and received app space', function() {
      var expected = 'yyyybbaxbba1',
          spy = sandbox.spy(http, 'get');

      cfApi.fetchAppStats(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('apps'));
      expect(actual).toMatch(new RegExp('stats'));
    });
  });

  describe('fetchSpaceUsers()', function() {
    it('should call fetch with spaces user roles url with space guid and the' +
       ' received space users action', function() {
      var expected = 'yyyybba1',
          spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchSpaceUsers(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('spaces'));
      expect(actual).toMatch(new RegExp('user_roles'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(userActions.receivedSpaceUsers);
      actual = spy.getCall(0).args[2];
      expect(actual).toEqual(expected);
    });
  });

  describe('fetchOrgUsers()', function() {
    it('should call fetch org users with org guid and received org users action',
        function() {
      var expected = 'yyyybba1',
          spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchOrgUsers(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('organizations'));
      expect(actual).toMatch(new RegExp('users'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(userActions.receivedOrgUsers);
      actual = spy.getCall(0).args[2];
      expect(actual).toEqual(expected);
    });
  });

  describe('fetchOrgUserRoles()', function() {
    it(`should call fetch org user roles with org guid and received org user
        roles action and org guid`, function() {
      var expectedOrgGuid = 'zkjvczcvzwexdvzdfa',
          spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchOrgUserRoles(expectedOrgGuid);
      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expectedOrgGuid));
      expect(actual).toMatch(new RegExp('organizations'));
      expect(actual).toMatch(new RegExp('roles'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(userActions.receivedOrgUserRoles);
      actual = spy.getCall(0).args[2];
      expect(actual).toEqual(expectedOrgGuid);
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

    it('should call org deleted action with guid', function(done) {
      var stub = sandbox.stub(http, 'delete'),
          spy = sandbox.spy(userActions, 'deletedUser'),
          expectedUserGuid = 'aldfskjmcx',
          expectedOrgGuid = 'sa09dvjakdnva';

      let testPromise = createPromise({status: true});
      stub.returns(testPromise);

      cfApi.deleteUser(expectedUserGuid, expectedOrgGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let args = spy.getCall(0).args;
        expect(args[0]).toEqual(expectedUserGuid);
        expect(args[1]).toEqual(expectedOrgGuid);
        done();
      });
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

  describe('deleteOrgUserPermissions()', function(done) {
    it('should call an http delete request on org user with permissions',
        function() {
      var spy = sandbox.spy(http, 'delete'),
          expectedUserGuid = 'zvmxncznv-9u8qwphu',
          expectedOrgGuid = '0291kdvakjbdfvhp',
          expectedPermission = 'manager';

      cfApi.deleteOrgUserPermissions(
        expectedUserGuid,
        expectedOrgGuid,
        expectedPermission).then(() => {
          expect(spy).toHaveBeenCalledOnce();
          let actual = spy.getCall(0).args[0];
          expect(actual).toMatch(new RegExp(expectedUserGuid));
          expect(actual).toMatch(new RegExp(expectedOrgGuid));
          expect(actual).toMatch(new RegExp(expectedPermission));
          done();
        });
    });

    it(`should call user action on a 400 response that has code 10006 with
        message about the error from cf`, function(done) {
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

      cfApi.deleteOrgUserPermissions(expectedUserGuid, 'asdf', 'role').then(
        () => {
        expect(spy).toHaveBeenCalledOnce();
        let args = spy.getCall(0).args;
        expect(args[0]).toEqual(expectedUserGuid);
        expect(args[1]).toEqual(expected);
        done();
      });
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
    it('should fetch services with org guid and received services action',
         function() {
      var expected = 'yyyybba1',
          spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchAllServices(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('services'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(serviceActions.receivedServices);

    });
  });

  describe('fetchAllServicePlans()', function() {
    it('calls fetch services plans with service guid and received plans',
         function() {
      var expected = 'yyyybba1',
          spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchAllServicePlans(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('service_plans'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(serviceActions.receivedPlans);
    });
  });
});
