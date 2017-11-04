
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api';
import loginActions from '../../../actions/login_actions';
import { loginActionTypes } from '../../../constants';

describe('loginActions', function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchStatus()', function () {
    beforeEach(function (done) {
      sandbox.stub(cfApi, 'getAuthStatus').returns(Promise.resolve('success'));
      sandbox.stub(AppDispatcher, 'handleViewAction');
      sandbox.stub(loginActions, 'receivedStatus').returns(Promise.resolve());
      sandbox.stub(loginActions, 'errorStatus').returns(Promise.resolve());

      loginActions.fetchStatus()
        .then(done, done.fail);
    });

    it('dispatches event', function () {
      expect(AppDispatcher.handleViewAction).toHaveBeenCalledWith(sinon.match({
        type: loginActionTypes.FETCH_STATUS
      }));
    });

    it('resolves the api promise to receivedStatus', function () {
      expect(loginActions.receivedStatus).toHaveBeenCalledWith('success');
    });

    describe('on failure', () => {
      it('calls errorStatus', done => {
        const err = new Error('failure');
        cfApi.getAuthStatus.returns(Promise.reject(err));

        loginActions.fetchStatus().then(() => {
          expect(loginActions.errorStatus).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('receivedStatus()', function () {
    let authStatus, result;
    beforeEach(function (done) {
      authStatus = { status: 'authorized' };
      sandbox.stub(AppDispatcher, 'handleServerAction');

      loginActions.receivedStatus(authStatus)
        .then(_result => {
          result = _result;
        })
        .then(done, done.fail);
    });

    it('dispatches event', function () {
      expect(AppDispatcher.handleServerAction).toHaveBeenCalledWith(sinon.match({
        type: loginActionTypes.RECEIVED_STATUS,
        authStatus
      }));
    });

    it('resolves authStatus', function () {
      expect(result).toBe(authStatus);
    });
  });

  describe('errorStatus()', function () {
    let err, result;

    beforeEach(function (done) {
      err = new Error('failure');
      sandbox.stub(AppDispatcher, 'handleServerAction');

      loginActions.errorStatus(err)
        .then(_result => {
          result = _result;
        })
        .then(done, done.fail);
    });

    it('dispatches event', function () {
      expect(AppDispatcher.handleServerAction).toHaveBeenCalledWith(sinon.match({
        type: loginActionTypes.ERROR_STATUS,
        err
      }));
    });

    it('resolves falsey', function () {
      expect(result).toBeFalsy();
    });
  });
});
