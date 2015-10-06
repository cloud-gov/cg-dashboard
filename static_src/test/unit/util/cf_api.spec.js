
import '../../global_setup.js';

import http from 'axios';

import cfApi from '../../../util/cf_api.js';
import loginActions from '../../../actions/login_actions.js';
import loginActionTypes from '../../../constants.js';

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
});
