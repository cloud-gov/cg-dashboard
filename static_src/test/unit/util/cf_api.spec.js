
import '../../global_setup.js';

import http from 'axios';
import Immutable from 'immutable';

import activityActions from '../../../actions/activity_actions.js';
import appActions from '../../../actions/app_actions.js';
import cfApi from '../../../util/cf_api.js';
import domainActions from '../../../actions/domain_actions.js';
import errorActions from '../../../actions/error_actions.js';
import loginActions from '../../../actions/login_actions.js';
import loginActionTypes from '../../../constants.js';
import orgActions from '../../../actions/org_actions.js';
import OrgStore from '../../../stores/org_store.js';
import quotaActions from '../../../actions/quota_actions.js';
import routeActions from '../../../actions/route_actions.js';
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
      errorFetchRes = { message: 'error', status: 404, data: {} };

  beforeEach(() => {
    OrgStore._data = new Immutable.List();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  function fetchErrorSetup() {
    const stub = sandbox.stub(http, 'get');
    const spy = sandbox.stub(errorActions, 'errorFetch').returns();
    const expected = errorFetchRes;

    let testPromise = createPromise(true, expected);
    stub.returns(testPromise);

    return spy;
  };

  function assertFetchError(spy) {
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(errorFetchRes);
  }

  describe('createRoute()', function() {
    it('should POST to the versioned /routes endpoint with data', function(done) {
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const host = 'fake-host';
      const path = 'fake-path';
      const expectedPayload = {
        domain_guid: domainGuid,
        space_guid: spaceGuid,
        host,
        path
      };
      sandbox.stub(routeActions, 'createdRoute').returns();
      const spy = sandbox.stub(http, 'post');
      spy.returns(createPromise({ data: {}}));

      cfApi.createRoute(domainGuid, spaceGuid, host, path).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toMatch('/routes');
        expect(args[1]).toEqual(expectedPayload);
        done();
      });
    });

    it('should call routeActions.createdRoute with response data', function(done) {
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const host = 'fake-host';
      const path = 'fake-path';
      const data = {
        domainGuid,
        spaceGuid
      };
      const stub = sandbox.stub(http, 'post');
      stub.returns(Promise.resolve({ data }));
      const actionSpy = sandbox.stub(routeActions, 'createdRoute').returns();

      cfApi.createRoute(domainGuid, spaceGuid, host, path).then(() => {
        const arg = actionSpy.getCall(0).args[0];
        expect(actionSpy).toHaveBeenCalledOnce();
        expect(arg).toEqual(data);
        done();
      });
    });

    it('should call route actions create error on request failure', function(done) {
      const spy = sandbox.stub(routeActions, 'errorCreateRoute');
      const stub = sandbox.stub(http, 'post');
      stub.returns(createPromise(true, errorFetchRes));

      cfApi.createRoute('a', 'b', 'c', 'd').then(() => {
        expect(spy).toHaveBeenCalledOnce();
        done();
      });

    });
  });

  describe('deleteRoute()', function() {
    it('should DELETE to the versioned /routes/:routeGuid endpoint with data', function(done) {
      const routeGuid = 'fake-route-guid';
      const spy = sandbox.stub(http, 'delete');
      spy.returns(Promise.resolve());

      cfApi.deleteRoute(routeGuid).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toMatch(`/routes/${routeGuid}`);
        done();
      });
    });

    it('should call routeActions.deletedRoute with response data', function(done) {
      const routeGuid = 'fake-route-guid';
      const stub = sandbox.stub(http, 'delete');
      const spy = sandbox.spy(routeActions, 'deletedRoute');
      stub.returns(Promise.resolve({}));

      cfApi.deleteRoute(routeGuid).then(() => {
        const arg = spy.getCall(0).args[0];
        expect(spy).toHaveBeenCalledOnce();
        expect(arg).toEqual(routeGuid);
        done();
      });
    });

    it('should call route actions error with guid on request failure',
        function(done) {
      const spy = sandbox.stub(routeActions, 'error');
      const stub = sandbox.stub(http, 'delete');
      stub.returns(createPromise(true, errorFetchRes));
      const routeGuid = 'zxcvasdf24';

      cfApi.deleteRoute(routeGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(routeGuid);
        arg = spy.getCall(0).args[1];
        expect(arg).toEqual(errorFetchRes.data);
        done();
      });
    });
  });

  describe('fetchOne()', function() {
    it('should call an http get request with the versioned url', function(done) {
      var stub = sandbox.stub(http, 'get'),
          expectedUrl = '/org/asldfkj';

      let testPromise = createPromise({data: {}});
      stub.returns(testPromise);

      cfApi.fetchOne(expectedUrl, function() { }).then(() => {
        expect(stub).toHaveBeenCalledOnce();
        let actual = stub.getCall(0).args[0];
        expect(actual).toEqual(cfApi.version + expectedUrl);
        done();
      });
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
      const spy = fetchErrorSetup();

      cfApi.fetchOne().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        done();
      });
    });

    it('should pass any additional arguments to the action', function(done) {
      const spy = sandbox.spy();
      const stub = sandbox.stub(http, 'get');
      const expectedArgA = 'arga';
      const expectedArgB = 'argb';

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

  describe('fetchAllPages()', function() {
    it('should call the action if there is only one page', function () {
      var stub = sandbox.stub(http, 'get');
      var expectedUrl = '/org/asldfkj';
      var data = {
        data: {
          next_url: false,
          total_pages: 1,
          resources: ['hey']
        }
      };

      stub.onCall(0).returns(createPromise(data));

      cfApi.fetchAllPages(expectedUrl, function(responses) {
        expect(stub).toHaveBeenCalledOnce();
        expect(responses).toEqual(['hey']);
        done();
      });
    });

    it('should call http.get once for every page', function (done) {
      var stub = sandbox.stub(http, 'get');
      var expectedUrl = '/org/asldfkj';
      var response = {
        data: {
          next_url: true,
          total_pages: 20,
          resources: ['hey']
        }
      };

      stub.returns(createPromise(response));

      cfApi.fetchAllPages(expectedUrl, function() {
        var callCount = stub.callCount;
        expect(callCount).toEqual(response.data.total_pages);
        done();
      });
    });

    it('should combine the responses from all the requests', function(done) {
      var stub = sandbox.stub(http, 'get');
      var expectedUrl = '/org/asldfkj';
      var dataOne = {
        data: {
          next_url: true,
          total_pages: 2,
          resources: ['hey']
        }
      };
      var dataTwo = Object.assign({}, dataOne, {
        data: {
          next_url: false,
          resources: ['yo', 'hello']
        }
      });

      stub.onFirstCall().returns(createPromise(dataOne));
      stub.onSecondCall().returns(createPromise(dataTwo));

      cfApi.fetchAllPages(expectedUrl, function(responses) {
        var combined = dataOne.data.resources.concat(dataTwo.data.resources);
        expect(stub).toHaveBeenCalledTwice();
        expect(responses).toEqual(combined);
        done();
      });
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
    it('calls http get request 2 times for all data with guid', (done) => {
      const spy = sandbox.stub(http, 'get');
      const expected = 'xxxaa2';

      let testPromise = createPromise({ data: {}});
      spy.returns(testPromise);

      cfApi.fetchOrg(expected).then(() => {
        let actual = spy.getCall(0).args[0];

        expect(spy).toHaveBeenCalledTwice();
        expect(actual).toMatch(new RegExp(expected));
        done();
      });
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
      const spy = sandbox.stub(http, 'get');
      let testPromise = createPromise({data: {}});
      spy.returns(testPromise);
      sandbox.stub(orgActions, 'receivedOrgs').returns();

      cfApi.fetchOrgs().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toMatch('organizations');
        done();
      });;
    });

    it('calls orgs received with orgs on success', function(done) {
      const expectedOrgs = [
        { metadata: { guid: 'xxxaasdf' }, entity: { name: 'testA' }},
        { metadata: { guid: 'xxxaasdg' }, entity: { name: 'testB' }}
      ];
      const expected = { data: { resources: expectedOrgs } };
      const stub = sandbox.stub(http, 'get');
      const spy = sandbox.stub(orgActions, 'receivedOrgs').returns();

      let testPromise = createPromise(expected);
      stub.returns(testPromise);

      let actual = cfApi.fetchOrgs().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(expectedOrgs);
        done();
      });;

    });
  });

  describe('fetchOrgMemoryUsage()', function() {
    it('calls http get request for orgs memory usage', function(done) {
      const spy = sandbox.stub(http, 'get');
      const expectedGuid = 'asdfad';

      let testPromise = createPromise({data: {}});
      spy.returns(testPromise);
      cfApi.fetchOrgMemoryUsage(expectedGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toMatch('memory_usage');
        expect(actual).toMatch(expectedGuid);
        done();
      });
    });
  });

  describe('fetchOrgMemoryLimit()', function() {
    it('calls http get request for orgs memory usage', function(done) {
      const spy = sandbox.stub(http, 'get');
      const expectedGuid = 'asdfad';
      const expectedOrg = {
        guid: expectedGuid,
        quota_definition_url: 'http://api.gov/quota_definitions/' +
          expectedGuid
      };

      let testPromise = createPromise({data: {}});
      spy.returns(testPromise);

      cfApi.fetchOrgMemoryLimit(expectedOrg).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toMatch('quota_definitions');
        expect(actual).toMatch(expectedGuid);
        done();
      });
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

  describe('fetchSpaces()', function () {
    it('calls fetch for the spaces endpoint', function () {
      const stub = sandbox.stub(http, 'get');
      const expected = [{ guid: 'fake-guid-one' }];
      let testPromise = createPromise(wrapInRes(expected));
      stub.returns(testPromise);

      cfApi.fetchSpaces();

      expect(stub).toHaveBeenCalledOnce();
      let actual = stub.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('spaces'));
    });

    it('calls spaceActions.receivedSpaces action', function (done) {
      const stub = sandbox.stub(http, 'get');
      const actionSpy = sandbox.spy(spaceActions, 'receivedSpaces');
      const expected = wrapInRes([{ guid: 'fake-guid-one' }]);
      let testPromise = createPromise({ data: { resources: expected } });
      stub.returns(testPromise);

      cfApi.fetchSpaces().then(() => {
        const args = actionSpy.getCall(0).args[0];
        expect(args).toEqual(expected);
        expect(actionSpy).toHaveBeenCalledOnce();
        done();
      });
    });
  });

  describe('fetchSpaceEvents()', function () {
    it('calls fetch all pages with space guid', function () {
      var spaceGuid = 'yyyybba1',
          spy = sandbox.stub(cfApi, 'fetchAllPages'),
          action;

        cfApi.fetchSpaceEvents(spaceGuid);
        expect(spy).toHaveBeenCalledOnce();

        action = spy.getCall(0).args[1];
        expect(action).toEqual(activityActions.receivedSpaceEvents);
    });
  });

  describe('fetchServiceInstance()', function() {
    it('should call fetch with spaces service instances url and recevied space',
        function() {
      var expected = '2qpofhskjdf',
          spy = sandbox.stub(cfApi, 'fetchOne');

      cfApi.fetchServiceInstance(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('service_instances'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(serviceActions.receivedInstance);
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
          spy = sandbox.stub(serviceActions, 'createdInstance').returns(),
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
      const stub = sandbox.stub(http, 'post');
      const spy = sandbox.stub(serviceActions, 'errorCreateInstance');
      const expectedErr = { status: 500, data: { code: 234 } };

      let testPromise = createPromise(true, expectedErr);
      stub.returns(testPromise);

      cfApi.createServiceInstance(
          expectedName,
          expectedSpaceGuid,
          expectedServicePlanGuid).then(() => {
            expect(spy).toHaveBeenCalledOnce();
            let actual = spy.getCall(0).args[0];
            expect(actual).toEqual(expectedErr.data);
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

  describe('fetchAppAll()', function () {
    it('should call fetchApp() and fetchAppStats()', function () {
      const guid = 'shouldCallTwoFnsGuid';
      const fetchAppSpy = sandbox.stub(cfApi, 'fetchApp');
      const fetchAppStatsSpy = sandbox.stub(cfApi, 'fetchAppStats');

      cfApi.fetchAppAll(guid);

      expect(fetchAppSpy).toHaveBeenCalledOnce();
      expect(fetchAppStatsSpy).toHaveBeenCalledOnce();
    });

    it('should call the receivedAppAll app action', function (done) {
      const guid = 'shouldCallActionCreatorGuid';
      const actionCreatorSpy = sandbox.spy(appActions, 'receivedAppAll');

      sandbox.stub(cfApi, 'fetchApp').returns(createPromise({data: {}}));
      sandbox.stub(cfApi, 'fetchAppStats').returns(createPromise({data: {}}));

      cfApi.fetchAppAll(guid).then(() => {
        expect(actionCreatorSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('fetchAppLogs()', function () {
    it('calls the recent log endpoint with the app guid', function () {
      var appGuid = 'fakeAppGuid';
      var spy = sandbox.spy(http, 'get');
      var expected = `log/recent?app=${appGuid}`;

      cfApi.fetchAppLogs(appGuid);

      let calledUrl = spy.getCall(0).args[0];
      expect(calledUrl).toEqual(expected);
    });

    it('calls the receivedAppLogs activity action', function (done) {
      var expected = 'yyyybba1',
          spy = sandbox.spy(activityActions, 'receivedAppLogs'),
          stub = sandbox.stub(http, 'get'),
          testPromise = createPromise({ status: true, data: [] });

      stub.returns(testPromise);

      cfApi.fetchAppLogs(expected).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        done();
      });
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

  describe('deleteOrgUserPermissions()', function() {
    it('should call an http delete request on org user with permissions',
        function(done) {
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

  describe('fetchServicePlan()', function() {
    it('should fetch plan with the plan guid', function() {
      const expected = 'zxbcjkladsfasdf';
      const spy = sandbox.stub(cfApi, 'fetchOne');

      cfApi.fetchServicePlan(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('service_plans'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(serviceActions.receivedPlan);
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

  describe('fetchRoutesForApp()', function() {
    it('calls fetch routes with app guid and received routes for app',
        function() {
      const expected = 'z098cvzxcv2983';
      const spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchRoutesForApp(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('apps'));
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('routes'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(routeActions.receivedRoutesForApp);
    });
  });

  describe('fetchRoutesForSpace()', function() {
    it('calls fetch routes with space guid and received routes',
        function() {
      const expected = '0cxcv23hhvzxcv2983';
      const spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchRoutesForSpace(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('spaces'));
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('routes'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(routeActions.receivedRoutes);
    });
  });

  describe('fetchPrivateDomain()', function() {
    it('should fetch domain with the domain guid', function() {
      var expected = 'xcvxyyb1',
          spy = sandbox.stub(cfApi, 'fetchOne');

      cfApi.fetchPrivateDomain(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('private_domains'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(domainActions.receivedDomain);
    });
  });

  describe('fetchSharedDomain()', function() {
    it('should fetch domain with the domain guid', function() {
      var expected = 'xcvxyyb1',
          spy = sandbox.stub(cfApi, 'fetchOne');

      cfApi.fetchSharedDomain(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('shared_domains'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(domainActions.receivedDomain);
    });
  });

  describe('fetchOrgsQuotas()', function () {
    it('should call receivedQuotasForAllOrgs action after fetchAllPages', function () {
      var spy = sandbox.stub(cfApi, 'fetchAllPages');

      cfApi.fetchOrgsQuotas();

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('quota_definitions'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(quotaActions.receivedQuotasForAllOrgs);
    });
  });

  describe('fetchSpacesQuotas()', function () {
    it('should call receivedQuotasForAllSpaces action after fetchAllPages', function () {
      var spy = sandbox.stub(cfApi, 'fetchAllPages');

      cfApi.fetchSpacesQuotas();

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('space_quota_definitions'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(quotaActions.receivedQuotasForAllSpaces);
    });
  });

  describe('fetchServiceBindings()', function() {
    it('should fetch bindings with app guid if supplied', function() {
      const expected = 'xcvxyyb1zxcv';
      const spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchServiceBindings(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('apps'));
      expect(actual).toMatch(new RegExp('service_bindings'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(serviceActions.receivedServiceBindings);
    });

    it('should fetch all service bindings if no app guid defined', function() {
      const spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchServiceBindings();

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('service_bindings'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(serviceActions.receivedServiceBindings);
    });
  });

  describe('putAppRouteAssociation()', function() {
    it('should PUT to the versioned /routes/:routeGuid/apps/:appGuid', function(done) {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';

      const spy = sandbox.stub(http, 'put');
      const testPromise = createPromise({status: true});
      spy.returns(testPromise);

      cfApi.putAppRouteAssociation(appGuid, routeGuid).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toMatch(`/routes/${routeGuid}/apps/${appGuid}`);
        done();
      });
    });

    it('should call routeActions.associatedApp() with the routeGuid and appGuid', function(done) {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';

      const stub = sandbox.stub(http, 'put');
      const spy = sandbox.spy(routeActions, 'associatedApp');
      const testPromise = createPromise({status: true});
      stub.returns(testPromise);

      cfApi.putAppRouteAssociation(appGuid, routeGuid).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toEqual(routeGuid);
        expect(args[1]).toEqual(appGuid);
        done();
      });
    });

    it('should call route actions error with guid on request failure',
        function(done) {
      const spy = sandbox.stub(routeActions, 'error');
      const stub = sandbox.stub(http, 'put');
      stub.returns(createPromise(true, errorFetchRes));
      const routeGuid = 'sdf2dsfzxcv4';

      cfApi.putAppRouteAssociation('adfads', routeGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(routeGuid);
        arg = spy.getCall(0).args[1];
        expect(arg).toEqual(errorFetchRes.data);
        done();
      });
    });
  });

  describe('deleteAppRouteAssociation()', function(done) {
    it('should DELETE to the versioned apps, routes url',
        function(done) {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';

      const spy = sandbox.stub(http, 'delete');
      const testPromise = createPromise({status: true});
      spy.returns(testPromise);

      cfApi.deleteAppRouteAssociation(appGuid, routeGuid).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toMatch(`/apps/${appGuid}/routes/${routeGuid}`);
        done();
      });
    });

    it('should call routeActions.unassociatedApp() with the routeGuid and appGuid',
        function(done) {
      const appGuid = 'fake-app-guid';
      const routeGuid = 'fake-route-guid';

      const stub = sandbox.stub(http, 'delete');
      const spy = sandbox.spy(routeActions, 'unassociatedApp');
      const testPromise = createPromise({status: true});
      stub.returns(testPromise);

      cfApi.deleteAppRouteAssociation(appGuid, routeGuid).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toEqual(routeGuid);
        expect(args[1]).toEqual(appGuid);
        done();
      });
    });

    it('should call route actions error with guid on request failure',
        function(done) {
      const spy = sandbox.stub(routeActions, 'error');
      const stub = sandbox.stub(http, 'delete');
      stub.returns(createPromise(true, errorFetchRes));
      const routeGuid = 'sdf2dsfzxcv4';

      cfApi.deleteAppRouteAssociation('adfads', routeGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(routeGuid);
        arg = spy.getCall(0).args[1];
        expect(arg).toEqual(errorFetchRes.data);
        done();
      });
    });
  });

  describe('putRouteUpdate()', function() {
    it('should call routeActions.updatedRoute() with the routeGuid and route', function(done) {
      const routeGuid = 'fake-route-guid';
      const domainGuid = 'fake-dommain-guid';
      const spaceGuid = 'fake-space-guid';
      const host = 'fake-host';
      const path = 'fake-path';
      const route = {
        host,
        path
      };
      const expected = {
        domain_guid: domainGuid,
        space_guid: spaceGuid,
        host,
        path
      };

      const stub = sandbox.stub(http, 'put');
      const spy = sandbox.spy(routeActions, 'updatedRoute');
      stub.returns(Promise.resolve({}));

      cfApi.putRouteUpdate(routeGuid, domainGuid, spaceGuid, route).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toEqual(routeGuid);
        expect(args[1]).toEqual(route);
        done();
      });
    });

    it('should call route actions error with guid on request failure',
        function(done) {
      const spy = sandbox.stub(routeActions, 'error');
      const stub = sandbox.stub(http, 'put');
      stub.returns(createPromise(true, errorFetchRes));
      const routeGuid = 'sdf2dsfzxcv4';
      const route = {
        host: 'fake-host',
        path: 'fake-path'
      };

      cfApi.putRouteUpdate(routeGuid, 'a', 'b', route).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(routeGuid);
        arg = spy.getCall(0).args[1];
        expect(arg).toEqual(errorFetchRes.data);
        done();
      });
    });
  });

  describe('createServiceBinding()', function() {
    const testBinding = {
      metadata: { guid: 'avlsdkj' },
      entity: { app_guid: 'zxcv', service_instance_guid: 'zxdfasd32' }
    };

    it('should request create binding with app, instance guid', function(done) {
      const appGuid = 'xvc34598mn';
      const serviceInstanceGuid = 'zcvx239784ahfjk';
      const spy = sandbox.stub(http, 'post');
      spy.returns(createPromise({data: testBinding}));

      cfApi.createServiceBinding(appGuid, serviceInstanceGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        const args = spy.getCall(0).args;
        expect(args[0]).toMatch('service_bindings');
        const expected = { app_guid: appGuid,
          service_instance_guid: serviceInstanceGuid };
        expect(args[1]).toEqual(expected);
        done();
      });
    });

    it('should call create error if request fails with err', function(done) {
      const appGuid = 'xvc34598mn';
      const serviceInstanceGuid = 'zcvx239784ahfjk';
      const expectedErr = { status: 500, data: { code: 23500 }};
      const stub = sandbox.stub(http, 'post');
      const spy = sandbox.spy(errorActions, 'errorPost');
      stub.returns(createPromise(true, expectedErr));

      cfApi.createServiceBinding(appGuid, serviceInstanceGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        const arg = spy.getCall(0).args[0];
        expect(arg).toEqual(expectedErr.data);
        done();
      });
    });

    it('should call bound service with response if successful', function(done) {
      const appGuid = 'xvc34598mn';
      const serviceInstanceGuid = 'zcvx239784ahfjk';
      const expected = { data: { metadata: { guid: 'adfdsafa'}, entity: {}}};
      const stub = sandbox.stub(http, 'post');
      const spy = sandbox.spy(serviceActions, 'boundService');
      stub.returns(createPromise(expected));

      cfApi.createServiceBinding(appGuid, serviceInstanceGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        const arg = spy.getCall(0).args[0];
        expect(arg).toEqual(expected.data);
        done();
      });
    });
  });

  describe('deleteServiceBinding()', function() {
    it('should call delete with binding guid', function(done) {
      const bindingGuid = 'vmxcv89x7c987';
      const binding = {
        guid: bindingGuid
      };
      const spy = sandbox.stub(http, 'delete');
      spy.returns(createPromise({data: {}}));

      cfApi.deleteServiceBinding(binding).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        const arg = spy.getCall(0).args[0];
        expect(arg).toMatch('service_bindings');
        done();
      });
    });

    it('should call delete error if request fails', function(done) {
      const bindingGuid = 'v3948589x7c987';
      const binding = {
        guid: bindingGuid
      };
      const expectedErr = { status: 503, data: { code: 23500 }};
      const stub = sandbox.stub(http, 'delete');
      const spy = sandbox.spy(errorActions, 'errorDelete');
      stub.returns(createPromise(true, expectedErr));

      cfApi.deleteServiceBinding(binding).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        const arg = spy.getCall(0).args[0];
        expect(arg).toEqual(expectedErr.data);
        done();
      });

    });

    it('should call unbound service with binding if successful', function(done) {
      const bindingGuid = 'v3948589x7c987';
      const binding = {
        guid: bindingGuid
      };
      const expected = { data: {}};
      const stub = sandbox.stub(http, 'delete');
      const spy = sandbox.spy(serviceActions, 'unboundService');
      stub.returns(createPromise(expected));

      cfApi.deleteServiceBinding(binding).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        const arg = spy.getCall(0).args[0];
        expect(arg).toEqual(binding);
        done();
      });
    });
  });
});
