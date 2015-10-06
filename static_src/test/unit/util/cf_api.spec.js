
import '../../global_setup.js';

import http from 'axios';

import cfApi from '../../../util/cf_api.js';

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
  });
});
