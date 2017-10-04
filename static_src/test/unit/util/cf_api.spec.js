
import '../../global_setup.js';

import http from 'axios';
import Immutable from 'immutable';
import moxios from 'moxios';

import cfApi, {
  tryParseJson,
  encodeFilter,
  encodeFilters
} from '../../../util/cf_api';
import domainActions from '../../../actions/domain_actions.js';
import errorActions from '../../../actions/error_actions.js';
import loginActions from '../../../actions/login_actions.js';
import orgActions from '../../../actions/org_actions.js';
import OrgStore from '../../../stores/org_store.js';
import quotaActions from '../../../actions/quota_actions.js';
import routeActions from '../../../actions/route_actions.js';
import userActions from '../../../actions/user_actions.js';
import { wrapInRes } from '../helpers.js';

function createPromise(res, err) {
  // TODO figure out how to do this with actual Promise object.
  if (!err) {
    return Promise.resolve(res);
  } else {
    return Promise.reject(err);
  }
};

describe('cfApi', function() {
  let sandbox;
  let errorFetchRes = { message: 'error', status: 404, data: {} };
  let fakeCFErrorRes = {
    message: 'Request returned an error state',
    response: {
      status: 500,
      data: {
        code: '234',
        description: 'Something went wrong'
      }
    }
  };

  beforeEach(() => {
    OrgStore._data = new Immutable.List();
    sandbox = sinon.sandbox.create();
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
    sandbox.restore();
  });

  function fetchErrorSetup() {
    const stub = sandbox.stub(http, 'get');
    const spy = sandbox.stub(errorActions, 'errorFetch').returns();
    const expected = fakeCFErrorRes;

    let testPromise = createPromise(true, expected);
    stub.returns(testPromise);

    return spy;
  };

  function assertFetchError(spy) {
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(errorFetchRes);
  }

  describe('formatSplitResponse()', function() {
    it('should combine sepaarate entity and metadata to one object', function() {
      const resource = {
        metadata: { guid: 'xzcvzc' },
        entity: { name: 'blah' }
      };

      const actual = cfApi.formatSplitResponse(resource);

      expect(actual.guid).toBeTruthy();
      expect(actual.name).toBeTruthy();
      expect(actual.metadata).toBeFalsy();
      expect(actual.entity).toBeFalsy();
    });
  });

  describe('postCreateNewUserWithGuid()', function() {
    it('create a new user through a post request to cloud foundry', function(done) {
      const userGuid = 'fake-user-guid';
      const expectedPayload = {
        guid: userGuid,
      };
      const spy = sandbox.stub(http, 'post');
      spy.returns(createPromise({ data: {}}));

      cfApi.postCreateNewUserWithGuid(userGuid).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toMatch('/users');
        expect(args[1]).toEqual(expectedPayload);
        done();
      });
    });
  });

  describe('putAssociateUserToOrganization()', function() {
    it('add a user to an org on cloud foundry', function(done) {
      const orgGuid = 'fake-org-guid';
      const userGuid = 'fake-user-guid';
      const spy = sandbox.stub(http, 'put');
      spy.returns(createPromise({ data: {}}));

      cfApi.putAssociateUserToOrganization(userGuid, orgGuid).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toMatch(`/organizations/${orgGuid}/users/${userGuid}`);
        done();
      });
    });
  });

  describe('putAssociateUserToSpace()', () => {
    it('associates a user to a space', () => {
      const orgGuid = 'an-org';
      const entityGuid = 'fake-space-guid';
      const userGuid = 'fake-user-guid';
      const spy = sandbox.stub(http, 'put');
      const putUserToOrgSpy = sandbox.stub(cfApi, 'putAssociateUserToOrganization');

      spy.returns(createPromise({ data: {}}));
      putUserToOrgSpy.returns(createPromise());

      cfApi.putAssociateUserToSpace(userGuid, orgGuid, entityGuid).then(() => {
        const args = spy.getCall(0).args;
        expect(putUserToOrgSpy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toMatch(`/spaces/${entityGuid}/auditors/${userGuid}`);
        done();
      });
    });
  });

  describe('formatSplitResponse()', function() {
    var testRezs;

    beforeEach(function() {
      testRezs = [
        { entity: { name: 'e1' }, metadata: { guid: 'mmmmmn' }},
        { entity: { name: 'e2' }, metadata: { guid: 'mmmmmo' }}
      ];
    });

    it('should merge entity with metadata for each resource', function() {
      var actual = cfApi.formatSplitResponses(testRezs);

      expect(actual[0]).toEqual({ name: 'e1', guid: 'mmmmmn'});
    });

    it('should not modify the original data', function() {
      var clone = testRezs.slice(0);

      cfApi.formatSplitResponses(testRezs);

      expect(clone).toEqual(testRezs);
    });
  });

  describe('tryParseJson()', function () {
    it('should parse out the JSON', function (done) {
      const field = '{"amount":{"usd":0.1}}';
      const expected = { amount: { usd: 0.1 } };

      tryParseJson(field)
        .then(parsed => {
          expect(parsed).toEqual(expected);
        })
        .then(done, done.fail);
    });

    it('accepts undefined', function (done) {
      tryParseJson(undefined)
        .then(parsed => {
          expect(parsed).toEqual(null);
        })
        .then(done, done.fail);
    });

    it('rejects on error', function (done) {
      const field = '{"amount"';

      tryParseJson(field)
        .then(done.fail)
        .catch(err => {
          expect(err).toEqual(jasmine.any(Error));
          done();
        });
    });
  });

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
      }).catch(done.fail);
    });

    it('should call routeActions.createdRoute with response data', function(done) {
      const domainGuid = 'fake-domain-guid';
      const spaceGuid = 'fake-space-guid';
      const host = 'fake-host';
      const path = 'fake-path';
      const data = {
        metadata: { guid: 'zx' },
        entity: {
          domainGuid,
          spaceGuid
        }
      };
      const stub = sandbox.stub(http, 'post');
      stub.returns(Promise.resolve({ data }));
      const actionSpy = sandbox.stub(routeActions, 'createdRoute').returns();

      cfApi.createRoute(domainGuid, spaceGuid, host, path).then(() => {
        const arg = actionSpy.getCall(0).args[0];
        expect(actionSpy).toHaveBeenCalledOnce();
        expect(arg).toEqual(cfApi.formatSplitResponse(data));
        done();
      }).catch(done.fail);
    });

    it('should call route actions create error on request failure', function(done) {
      const spy = sandbox.stub(routeActions, 'errorCreateRoute');
      const stub = sandbox.stub(http, 'post');
      stub.returns(createPromise(true, fakeCFErrorRes));

      cfApi.createRoute('a', 'b', 'c', 'd').catch(() => {
        expect(spy).toHaveBeenCalledOnce();
        done();
      });
    });
  });

  describe('deleteRoute()', function() {
    it('should DELETE to the versioned /routes/:routeGuid endpoint with data',
        function(done) {
      const routeGuid = 'fake-route-guid';
      const spy = sandbox.stub(http, 'delete');
      spy.returns(Promise.resolve());

      cfApi.deleteRoute(routeGuid).then(() => {
        const args = spy.getCall(0).args;
        expect(spy).toHaveBeenCalledOnce();
        expect(args[0]).toMatch(`/routes/${routeGuid}`);
        done();
      }).catch(done.fail);
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
      }).catch(done.fail);
    });

    it('should call route actions error with guid on request failure',
        function(done) {
      const spy = sandbox.stub(routeActions, 'error');
      const stub = sandbox.stub(http, 'delete');
      stub.returns(createPromise(true, fakeCFErrorRes));
      const routeGuid = 'zxcvasdf24';

      cfApi.deleteRoute(routeGuid).catch(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(routeGuid);
        arg = spy.getCall(0).args[1];
        expect(arg).toEqual(fakeCFErrorRes.response.data);
        done();
      }).catch(done.fail);
    });
  });

  describe('fetchOne()', function() {
    it('should call an http get request with the versioned url', function(done) {
      const stub = sandbox.stub(http, 'get');
      const expectedUrl = '/org/asldfkj';

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
      const expected = { data: { metadata: { guid: 'q39g08hgdih' }}};
      const stub = sandbox.stub(http, 'get');
      const spy = sandbox.spy();

      let testPromise = createPromise(expected);
      stub.returns(testPromise);

      cfApi.fetchOne('/thing/adjfk', spy).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toEqual(expected.data.metadata);
        done();
      });;
    });

    it('should call the fetch error action on failure', function(done) {
      const spy = fetchErrorSetup();

      cfApi.fetchOne().catch(() => {
        expect(spy).toHaveBeenCalledOnce();
        done();
      });
    });

    it('should pass any additional arguments to the action', function(done) {
      const spy = sandbox.spy();
      const stub = sandbox.stub(http, 'get');
      const expectedArgA = 'arga';
      const expectedArgB = 'argb';

      let testPromise = createPromise({ data: { metadata: { guid: 'adf' }}});
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
    it('should call the action if there is only one page', function (done) {
      var stub = sandbox.stub(http, 'get');
      var expectedUrl = '/org/asldfkj';
      var data = {
        data: {
          next_url: false,
          total_pages: 1,
          resources: [
            { metadata: { guid: 'zxcv' }}
          ]
        }
      };

      stub.onCall(0).returns(createPromise(data));

      cfApi.fetchAllPages(expectedUrl, function(responses) {
        expect(stub).toHaveBeenCalledOnce();
        expect(responses).toEqual([{ guid: 'zxcv' }]);
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
          resources: [
            { metadata: { guid: 'zxcv' }}
          ]
        }
      };

      stub.returns(createPromise(response));

      cfApi.fetchAllPages(expectedUrl, function() {
        var callCount = stub.callCount;
        expect(callCount).toEqual(response.data.total_pages);
        done();
      }).catch(done.fail);
    });

    it('should combine the responses from all the requests', function(done) {
      var stub = sandbox.stub(http, 'get');
      var expectedUrl = '/org/asldfkj';
      var dataOne = {
        data: {
          next_url: true,
          total_pages: 3,
          resources: [
            { metadata: { guid: 'higw' }}
          ]
        }
      };
      var dataTwo =  {
        data: {
          next_url: true,
          resources: [
            { metadata: { guid: 'dmc' }},
            { metadata: { guid: 'abc' }}
          ]
        }
      };
      const dataThree = {
        data: {
          next_url: false,
          resources: [
            { metadata: { guid: '23fd' }},
            { metadata: { guid: '234s' }}
          ]
        }
      }

      stub.onFirstCall().returns(createPromise(dataOne));
      stub.onSecondCall().returns(createPromise(dataTwo));
      stub.onThirdCall().returns(createPromise(dataThree));

      cfApi.fetchAllPages(expectedUrl, function(responses) {
        const combined = dataOne.data.resources.concat(dataTwo.data.resources)
          .concat(dataThree.data.resources).map(
          (r) => Object.assign({}, r.metadata, r.entity));
        expect(stub).toHaveBeenCalledThrice();
        expect(responses).toEqual(combined);
        done();
      }).catch(done.fail);
    });

    describe('given data', function () {
      let entities, path, data, results, expectedUrl;

      beforeEach(function (done) {
        path = '/multipage-call-with-data';
        data = { sort: 1 };
        expectedUrl = `/v2${path}`;

        const entity1 = { guid: 'entity1' };
        const entity2 = { guid: 'entity2' };
        const entity3 = { guid: 'entity3' };
        const entity4 = { guid: 'entity4' };
        const entity5 = { guid: 'entity5' };

        entities = [
          entity1,
          entity2,
          entity3,
          entity4,
          entity5
        ];

        sandbox.stub(http, 'get')
          .onFirstCall().returns(Promise.resolve({
            data: {
              next_url: true,
              total_pages: 3,
              resources: [
                { metadata: entity1}
              ]
            }
          }))
          .onSecondCall().returns(Promise.resolve({
            data: {
              next_url: true,
              resources: [
                { metadata: entity2},
                { metadata: entity3}
              ]
            }
          }))
          .onThirdCall().returns(Promise.resolve({
            data: {
              next_url: false,
              resources: [
                { metadata: entity4},
                { metadata: entity5}
              ]
            }
          }));

        cfApi.fetchAllPages(path, data, function(responses) {
          results = responses;
        }).then(done, done.fail);
      });

      it('returns the entities', function () {
        expect(results).toEqual(entities);
      });

      it('calls http.get 3 times', function () {
        expect(http.get).toHaveBeenCalledThrice();
      });

      it('calls the url first with data', function () {
        const call = http.get.firstCall;
        expect(call).toHaveBeenCalledWith(expectedUrl, sinon.match({ params: data }));
      });

      it('appends the page to existing parameters on second call', function () {
        const call = http.get.secondCall;
        expect(call).toHaveBeenCalledWith(expectedUrl, sinon.match({ params: { ...data, page: 2 } }));
      });

      it('appends the page to existing parameters on third call', function () {
        const call = http.get.thirdCall;
        expect(call).toHaveBeenCalledWith(expectedUrl, sinon.match({ params: { ...data, page: 3 } }));
      });
    });
  });

  describe('getAuthStatus()', function () {
    beforeEach(function (done) {
      sandbox.stub(http, 'get').returns(Promise.resolve({ data: { status: 'authorized' } }));

      cfApi.getAuthStatus().then(done, done.fail);
    });

    it('calls http get request for auth status', () => {
      expect(http.get).toHaveBeenCalledOnce();
      const actual = http.get.getCall(0).args[0];
      expect(actual).toMatch('authstatus');
    });

    describe('given authorized', function () {
      let authStatus, result;

      beforeEach(function (done) {
        authStatus = { status: 'logged_in' };
        http.get.returns(Promise.resolve({ data: authStatus }));

        cfApi.getAuthStatus()
          .then(_result => {
            result = _result;
            done();
          })
          .catch(done.fail);
      });

      it('calls received status with status on success', () => {
        expect(result).toBe(authStatus);
      });
    });

    describe('given error', function () {
      let err, result;

      beforeEach(function (done) {
        err = new Error('network error');
        http.get.returns(Promise.reject(err));

        cfApi.getAuthStatus()
          .then(done.fail)
          .catch(_result => {
            result = _result;
            done();
          });
      });

      it('rejects with error', () => {
        expect(result).toBe(err);
      });
    });
  });

  describe('fetchOrg()', () => {
    it('calls http get request 4 times for all data with guid', (done) => {
      const expected = 'xxxaa2';
      const spy = sandbox.stub(http, 'get').returns(Promise.resolve({ data: {} }));

      cfApi.fetchOrg(expected).then(() => {
        const url = spy.getCall(0).args[0];

        expect(spy.callCount).toBe(4);
        expect(url).toMatch(new RegExp(expected));
      })
      .then(done, done.fail);
    });
  });

  describe('fetchOrgs()', function() {
    it('calls http get request for orgs', function(done) {
      const spy = sandbox.stub(http, 'get');
      let testPromise = createPromise({data: { resources: [{metadata: {guid: 'sdf'}}]}});
      spy.returns(testPromise);
      sandbox.stub(orgActions, 'receivedOrgs').returns();

      cfApi.fetchOrgs().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toMatch('organizations');
        done();
      });
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
  });

  describe('fetchSpaceEvents()', function () {
    let spaceGuid;

    beforeEach(function (done) {
      spaceGuid = 'yyyybba1';
      sandbox.stub(cfApi, 'fetchAllPages').returns(Promise.resolve());

      cfApi.fetchSpaceEvents(spaceGuid)
        .then(done, done.fail);
    });

    it('calls fetch all pages', function () {
      expect(cfApi.fetchAllPages).toHaveBeenCalledOnce();
    });

    it('calls fetch all pages with space guid', function () {
      expect(cfApi.fetchAllPages).toHaveBeenCalledWith(sinon.match(spaceGuid));
    });

    describe('with appGuid', function () {
      let appGuid;

      beforeEach(function (done) {
        appGuid = 'abcd';
        cfApi.fetchAllPages.returns(Promise.resolve());

        cfApi.fetchSpaceEvents(spaceGuid, { appGuid })
          .then(done, done.fail);
      });

      it('calls fetch all pages with query', function () {
        expect(cfApi.fetchAllPages).toHaveBeenCalledWith(sinon.match(spaceGuid), sinon.match({ q: `actee:${appGuid}` }));
      });
    });
  });

  describe('fetchServiceInstance()', function () {
    it('should call fetch with spaces service instances url and recevied space', function () {
      const expected = '2qpofhskjdf',
        spy = sandbox.stub(cfApi, 'fetchOne');

      cfApi.fetchServiceInstance(expected);

      expect(spy).toHaveBeenCalledOnce();
      const actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('service_instances'));
    });
  });

  describe('fetchServiceInstances()', function () {
    it('should call fetch with spaces service instances url and recevied space', function () {
      const expected = 'yyyybba1',
        spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchServiceInstances(expected);

      expect(spy).toHaveBeenCalledOnce();
      const actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('spaces'));
      expect(actual).toMatch(new RegExp('service_instances'));
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
  });

  describe('deleteUnboundServiceInstance()', function() {
    it('should call http delete request on service route with service guid',
        function(done) {
      var spy = sandbox.stub(http, 'delete').returns(Promise.resolve()),
          expectedGuid = 'yyasdflkjayybbaal1',
          expected = { guid: expectedGuid, url: '/'+ expectedGuid}

      cfApi.deleteUnboundServiceInstance(expected).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toMatch(new RegExp(expectedGuid));
        done();
      }).catch(done.fail);
    });
  });

  describe('fetchApp()', function () {
    it('should call fetch with apps url', function () {
      const expected = 'yyyybba1',
        spy = sandbox.stub(cfApi, 'fetchOne');

      cfApi.fetchApp(expected);

      expect(spy).toHaveBeenCalledOnce();
      const url = spy.getCall(0).args[0];
      expect(url).toMatch(new RegExp(expected));
      expect(url).toMatch(new RegExp('apps'));
    });
  });

  describe('fetchAppStats()', function () {
    it('should call fetch with app stats url', function () {
      const expected = 'yyyybbaxbba1',
        spy = sandbox.spy(http, 'get');

      cfApi.fetchAppStats(expected);

      expect(spy).toHaveBeenCalledOnce();
      const url = spy.getCall(0).args[0];
      expect(url).toMatch(new RegExp(expected));
      expect(url).toMatch(new RegExp('apps'));
      expect(url).toMatch(new RegExp('stats'));
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
  });

  describe('postAppRestart()', function () {
    it('should http post to restage route with app guid', function(done) {
      const appGuid = 'xvc34598mn';
      const spy = sandbox.stub(http, 'post');
      spy.returns(createPromise({response: 'success'}));

      cfApi.postAppRestart(appGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        const args = spy.getCall(0).args;
        expect(args[0]).toMatch('apps');
        expect(args[0]).toMatch(appGuid);
      }).then(done, done.fail);
    });
  });

  describe('putApp()', function() {
    it('returns mapped app from the response', function (done) {
      const put = sandbox.stub(http, 'put', (url, app) => {
        return createPromise({data: {entity: app}});
      });
      const expectedApp = {guid: '123'};

      cfApi.putApp(expectedApp.guid, expectedApp)
        .then(function () {
          let [url, app] = put.args[0];
          expect(url).toMatch(new RegExp('/v2/apps/123$'));
          expect(app).toEqual(expectedApp);
          done();
        }).catch(done.fail);
    });
  })

  describe('fetchSpaceUserRoles()', function() {
    it('should call fetch with spaces user roles url with space guid and the' +
       ' received space users action', function() {
      var expected = 'yyyybba1',
          spy = sandbox.spy(cfApi, 'fetchAllPages');

      cfApi.fetchSpaceUserRoles(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('spaces'));
      expect(actual).toMatch(new RegExp('user_roles'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(jasmine.any(Function));
    });
  });

  describe('fetchOrgUsers()', function() {
    it('should call fetch org users with org guid and received org users action',
        function() {
      var expected = 'yyyybba1',
          spy = sandbox.spy(cfApi, 'fetchAllPages');

      cfApi.fetchOrgUsers(expected);

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('organizations'));
      expect(actual).toMatch(new RegExp('users'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(jasmine.any(Function));
    });
  });

  describe('fetchOrgUserRoles()', function() {
    it(`should call fetch org user roles with org guid and received org user
        roles action and org guid`, function() {
      var expectedOrgGuid = 'zkjvczcvzwexdvzdfa',
          spy = sandbox.spy(cfApi, 'fetchAllPages');

      cfApi.fetchOrgUserRoles(expectedOrgGuid);
      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expectedOrgGuid));
      expect(actual).toMatch(new RegExp('organizations'));
      expect(actual).toMatch(new RegExp('roles'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(jasmine.any(Function));
    });
  });

  describe('deleteUser()', function() {
    it('should call a http delete request on the org and user', function(done) {
      var spy = sandbox.stub(http, 'delete').returns(Promise.resolve({ status: 500 })),
          expectedUserGuid = 'zvmxncznv-9u8qwphu',
          expectedOrgGuid = '0291kdvakjbdfvhp';

      cfApi.deleteUser(expectedUserGuid, expectedOrgGuid).then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toMatch(new RegExp(expectedUserGuid));
        expect(actual).toMatch(new RegExp(expectedOrgGuid));
        done();
      }).catch(done.fail);
    });
  });

  describe('deleteOrgUserCategory()', function() {
    it('should call a http delete request on the org user with category ',
        function(done) {
      var spy = sandbox.stub(http, 'delete').returns(Promise.resolve({})),
          expectedUserGuid = 'zvmxncznv-9u8qwphu',
          expectedOrgGuid = '0291kdvakjbdfvhp',
          expectedCategory = 'some_role';

      cfApi.deleteOrgUserCategory(
        expectedUserGuid,
        expectedOrgGuid,
        expectedCategory).then(() => {
          expect(spy).toHaveBeenCalledOnce();
          let actual = spy.getCall(0).args[0];
          expect(actual).toMatch(new RegExp(expectedUserGuid));
          expect(actual).toMatch(new RegExp(expectedOrgGuid));
          expect(actual).toMatch(new RegExp(expectedCategory));
          done();
      }).catch(done.fail);
    });
  });

  describe('deleteOrgUserPermissions()', function() {
    it('should call an http delete request on org user with permissions',
        function(done) {
      var spy = sandbox.stub(http, 'delete').returns(Promise.resolve({})),
          expectedUserGuid = 'zvmxncznv-9u8qwphu',
          expectedOrgGuid = '0291kdvakjbdfvhp',
          expectedApiKey = 'managers';

      cfApi.deleteOrgUserPermissions(
        expectedUserGuid,
        expectedOrgGuid,
        expectedApiKey).then(() => {
          expect(spy).toHaveBeenCalledOnce();
          let actual = spy.getCall(0).args[0];
          expect(actual).toMatch(new RegExp(expectedUserGuid));
          expect(actual).toMatch(new RegExp(expectedOrgGuid));
          expect(actual).toMatch(new RegExp(expectedApiKey));
          done();
        }).catch(done.fail);
    });

    it(`should call user action on a 400 response that has code 10006 with
        message about the error from cf`, function(done) {
      var spy = sandbox.spy(http, 'delete'),
          expectedUserGuid = 'zcvmzxncbvpafd',
          expectedOrgGuid = '0291kdvakjbdfvhp',
          expectedApiKey = 'managers',
          expectedResponse = {
            code: 10006,
            description: 'Please delete the user associations for your spaces',
            error_code: 'CF-AssociationNotEmpty'
          };
      moxios.stubOnce('DELETE', `/v2/organizations/${expectedOrgGuid}/${expectedApiKey}/${expectedUserGuid}`, {
        status: 400,
        response: expectedResponse
      });

      cfApi.deleteOrgUserPermissions(expectedUserGuid, expectedOrgGuid, expectedApiKey);
      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expectedUserGuid));
      expect(actual).toMatch(new RegExp(expectedOrgGuid));
      expect(actual).toMatch(new RegExp(expectedApiKey));
      done();
    });
  });

  describe('putOrgUserPermissions()', function() {
    it('should call an http put request on org user with permissions', function() {
      var spy = sandbox.spy(http, 'put'),
          expectedUserGuid = 'zvmxncznv-9u8qwphu',
          expectedOrgGuid = '0291kdvakjbdfvhp',
          expectedPermission = 'managers';

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

  describe('fetchAllServices()', function () {
    it('should fetch services with org guid', function () {
      const expected = 'yyyybba1',
        spy = sandbox.stub(cfApi, 'fetchMany');

      cfApi.fetchAllServices(expected);

      expect(spy).toHaveBeenCalledOnce();
      const actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('services'));
    });
  });

  describe('fetchServicePlan()', function () {
    it('should fetch plan with the plan guid', function () {
      const expected = 'zxbcjkladsfasdf';
      const spy = sandbox.stub(cfApi, 'fetchOne').returns(Promise.resolve());

      cfApi.fetchServicePlan(expected);

      expect(spy).toHaveBeenCalledOnce();
      const actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('service_plans'));
    });
  });

  describe('fetchAllServicePlans()', function () {
    it('calls fetch services plans with service guid and received plans', function () {
      const expected = 'yyyybba1',
        spy = sandbox.stub(cfApi, 'fetchMany').returns(Promise.resolve());

      cfApi.fetchAllServicePlans(expected);

      expect(spy).toHaveBeenCalledOnce();
      const actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('service_plans'));
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
      var spy = sandbox.stub(cfApi, 'fetchAllPages').returns(Promise.resolve());

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
      var spy = sandbox.stub(cfApi, 'fetchAllPages').returns(Promise.resolve());

      cfApi.fetchSpacesQuotas();

      expect(spy).toHaveBeenCalledOnce();
      let actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('space_quota_definitions'));
      actual = spy.getCall(0).args[1];
      expect(actual).toEqual(quotaActions.receivedQuotasForAllSpaces);
    });
  });

  describe('fetchServiceBindings()', function () {
    it('should fetch bindings with app guid if supplied', function () {
      const expected = 'xcvxyyb1zxcv';
      const spy = sandbox.stub(cfApi, 'fetchMany').returns(Promise.resolve());

      cfApi.fetchServiceBindings(expected);

      expect(spy).toHaveBeenCalledOnce();
      const actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp(expected));
      expect(actual).toMatch(new RegExp('apps'));
      expect(actual).toMatch(new RegExp('service_bindings'));
    });

    it('should fetch all service bindings if no app guid defined', function() {
      const spy = sandbox.stub(cfApi, 'fetchMany').returns(Promise.resolve());

      cfApi.fetchServiceBindings();

      expect(spy).toHaveBeenCalledOnce();
      const actual = spy.getCall(0).args[0];
      expect(actual).toMatch(new RegExp('service_bindings'));
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
      }).catch(done.fail);
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
      }).catch(done.fail);
    });

    it('should call route actions error with guid on request failure',
        function(done) {
      const spy = sandbox.stub(routeActions, 'error');
      const stub = sandbox.stub(http, 'put');
      stub.returns(createPromise(true, fakeCFErrorRes));
      const routeGuid = 'sdf2dsfzxcv4';

      cfApi.putAppRouteAssociation('adfads', routeGuid).catch(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(routeGuid);
        arg = spy.getCall(0).args[1];
        expect(arg).toEqual(fakeCFErrorRes.response.data);
        done();
      });
    });
  });

  describe('deleteAppRouteAssociation()', function() {
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
      }).catch(done.fail);
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
      }).catch(done.fail);
    });

    it('should call route actions error with guid on request failure',
        function(done) {
      const spy = sandbox.stub(routeActions, 'error');
      const stub = sandbox.stub(http, 'delete');
      stub.returns(createPromise(true, fakeCFErrorRes));
      const routeGuid = 'sdf2dsfzxcv4';

      cfApi.deleteAppRouteAssociation('adfads', routeGuid).catch(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(routeGuid);
        arg = spy.getCall(0).args[1];
        expect(arg).toEqual(fakeCFErrorRes.response.data);
        done();
      }).catch(done.fail);
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
      }).catch(done.fail);
    });

    it('should call route actions error with guid on request failure',
        function(done) {
      const spy = sandbox.stub(routeActions, 'error');
      const stub = sandbox.stub(http, 'put');
      stub.returns(createPromise(true, fakeCFErrorRes));
      const routeGuid = 'sdf2dsfzxcv4';
      const route = {
        host: 'fake-host',
        path: 'fake-path'
      };

      cfApi.putRouteUpdate(routeGuid, 'a', 'b', route).catch(() => {
        expect(spy).toHaveBeenCalledOnce();
        let arg = spy.getCall(0).args[0];
        expect(arg).toEqual(routeGuid);
        arg = spy.getCall(0).args[1];
        expect(arg).toEqual(fakeCFErrorRes.response.data);
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
      }).catch(done.fail);
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
      }).catch(done.fail);
    });
  });

  describe('fetchUser()', function () {
    let userGuid;

    beforeEach(function (done) {
      userGuid = 'user123';
      sandbox.stub(http, 'get').returns(Promise.resolve({ data: { entity: { guid: 'user123' } } }));

      cfApi.fetchUser(userGuid).then(done, done.fail);
    });

    it('calls user endpoint', function () {
      expect(http.get).toHaveBeenCalledOnce();
      expect(http.get).toHaveBeenCalledWith(sinon.match(`/users/${userGuid}`));
    });
  });

  describe('fetchUserSpaces()', function () {
    let user, space, result;
    beforeEach(function (done) {
      user = { guid: 'user123' };
      space = { guid: 'space123' };
      sandbox.stub(http, 'get').returns(Promise.resolve({
        data: {
          resources: [{ metadata: space, entity: {} }]
        }
      }));

      cfApi.fetchUserSpaces(user.guid)
        .then(_result => {
          result = _result;
        })
        .then(done, done.fail);
    });

    it('calls user spaces endpoint', function () {
      expect(http.get).toHaveBeenCalledWith(sinon.match(`/users/${user.guid}/spaces`));
    });

    it('resolves with list of spaces', function () {
      expect(result).toEqual([space]);
    });

    describe('given orgGuid', function () {
      let orgGuid;
      beforeEach(function (done) {
        orgGuid = 'org123';

        cfApi.fetchUserSpaces(user.guid, { orgGuid })
          .then(done, done.fail);
      });

      it('includes query parameter for organization_guid', function () {
        expect(http.get)
          .toHaveBeenCalledWith(
            sinon.match.string,
            sinon.match({ params: { q: `organization_guid:${orgGuid}` } })
          );
      });
    });
  });

  describe('fetchUserOrgs()', function () {
    let userGuid;
    let fetchAllPagesStub;

    beforeEach(function (done) {
      userGuid = 'user123';
      fetchAllPagesStub = sandbox.stub(cfApi, 'fetchAllPages').returns(
        Promise.resolve({ guid: userGuid }));

      cfApi.fetchUserOrgs(userGuid).then(done, done.fail);
    });

    it('calls user endpoint', function () {
      expect(fetchAllPagesStub).toHaveBeenCalledOnce();
      expect(fetchAllPagesStub).toHaveBeenCalledWith(
        `/users/${userGuid}/organizations`);
    });
  });

  describe('encodeFilter()', function() {
    const tests = [
      {
        f: { filter: 'name', op: ':', value: 'a' },
        out: 'name:a'
      },
      {
        f: { filter: 'name', op: '>', value: 'a' },
        out: 'name>a'
      },
      {
        f: { filter: 'name', op: '>=', value: 'a' },
        out: 'name>=a'
      },
      {
        f: { filter: 'name', op: 'IN', value: ['a', 'b', 'c'] },
        out: 'name IN a,b,c'
      }
    ];
    for (const { f, out } of tests) {
      it('encodes the filters correctly', function() {
        expect(encodeFilter(f)).toEqual(out);
      });
    }
  });

  describe('encodeFilters()', function() {
    it('encodes the equal to filter correctly', function() {
      expect(encodeFilters([{ filter: 'name', op: ':', value: 'a' }])).toEqual([
        'name:a'
      ]);
    });
  });
});
