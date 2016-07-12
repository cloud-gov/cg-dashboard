
import '../../global_setup.js';

import http from 'axios';

import errorActions from '../../../actions/error_actions.js';
import uaaApi from '../../../util/uaa_api.js';
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

describe('uaaApi', function() {
  let sandbox;
  const errorFetchRes = { message: 'error' };

  function fetchErrorSetup() {
    var stub = sandbox.stub(http, 'get'),
        spy = sandbox.spy(errorActions, 'errorFetch'),
        expected = errorFetchRes;

    let testPromise = createPromise(true, expected);
    stub.returns(testPromise);

    return spy;
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchUserInfo()', function() {
    it('should call an http get request for uaa user info', function(done) {
      var spy = sandbox.spy(http, 'get');

      uaaApi.fetchUserInfo().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        let actual = spy.getCall(0).args[0];
        expect(actual).toMatch('userinfo');
        done();
      });
    });

    it('should call a user action current user info received on success',
        function(done) {
      const expected = { user_id: 'zcxcvbxcvb', user_name: 'brain' };
      let stub = sandbox.stub(http, 'get');
      let spy = sandbox.spy(userActions, 'receivedCurrentUserInfo');

      let testPromise = createPromise({data: expected});
      stub.returns(testPromise);

      uaaApi.fetchUserInfo().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(expected);
        done();
      });
    });

    it('should call a fetch error on failure', function() {
      var spy = fetchErrorSetup();

      uaaApi.fetchUserInfo().then(() => {
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(errorFetchRes);
        done();
      });
    });
  });
});
