
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

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchUserInfo()', function () {
    beforeEach(function (done) {
      sandbox.stub(http, 'get').returns(Promise.resolve({ data: { user_id: 'user123' } }));

      uaaApi.fetchUserInfo().then(done, done.fail);
    });

    it('should call an http get request for uaa user info', function () {
      expect(http.get).toHaveBeenCalledOnce();
      expect(http.get).toHaveBeenCalledWith(sinon.match(/\/userinfo$/));
    });
  });

  describe('fetchUaaInfo()', function () {
    beforeEach(function (done) {
      sandbox.stub(http, 'get').returns(Promise.resolve({data: {}}));

      uaaApi.fetchUaaInfo('user123').then(done, done.fail);
    });

    it('should call an http get request for uaa permission info', function () {
      expect(http.get).toHaveBeenCalledOnce();

      expect(http.get).toHaveBeenCalledWith(sinon.match(/\/uaainfo\?uaa_guid=user123$/));
    });
  });

  describe('getInviteUaaUser()', function () {
    beforeEach(function () {
    });

    it('should work', function () {
    });
  });

  describe('sendInviteEmail()', function () {
    beforeEach(function () {
    });

    it('should work', function () {
    });
  });
});
