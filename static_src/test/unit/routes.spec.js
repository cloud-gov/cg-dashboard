
import '../global_setup.js';
import ReactDOM from 'react-dom';
import errorActions from '../../actions/error_actions';
import loginActions from '../../actions/login_actions';
import LoginStore from '../../stores/login_store';
import orgActions from '../../actions/org_actions';
import spaceActions from '../../actions/space_actions';
import userActions from '../../actions/user_actions';
import windowUtil from '../../util/window';
import { checkAuth } from '../../main';


describe('routes', function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('checkAuth()', function () {
    beforeEach(function () {
      sandbox.stub(loginActions, 'fetchStatus').returns(Promise.resolve({ status: 'authorized' }));
      sandbox.stub(userActions, 'fetchCurrentUser').returns(Promise.resolve());
      sandbox.stub(orgActions, 'fetchAll').returns(Promise.resolve());
      sandbox.stub(spaceActions, 'fetchAll').returns(Promise.resolve());
    });

    describe('given no arguments', function () {
      let next;

      beforeEach(function (done) {
        next = sandbox.spy(done);

        checkAuth(next);
      });

      it('calls next', function () {
        expect(next).toHaveBeenCalledOnce();
      });

      it('calls fetchStatus', function () {
        expect(loginActions.fetchStatus).toHaveBeenCalledOnce();
      });

      it('fetches page data', function () {
        expect(userActions.fetchCurrentUser).toHaveBeenCalledOnce();
        expect(orgActions.fetchAll).toHaveBeenCalledOnce();
        expect(spaceActions.fetchAll).toHaveBeenCalledOnce();
      });
    });

    describe('given multiple arguments', function () {
      let next;

      beforeEach(function (done) {
        next = sandbox.spy(done);

        checkAuth('orgGuid', 'spaceGuid', 'appGuid', next);
      });

      it('calls next', function () {
        expect(next).toHaveBeenCalledOnce();
      });

      it('calls fetchStatus', function () {
        expect(loginActions.fetchStatus).toHaveBeenCalledOnce();
      });

      it('fetches page data', function () {
        expect(userActions.fetchCurrentUser).toHaveBeenCalledOnce();
        expect(orgActions.fetchAll).toHaveBeenCalledOnce();
        expect(spaceActions.fetchAll).toHaveBeenCalledOnce();
      });

      it('calls userActions.fetchCurrentUser() with guids for filtered API calls', function () {
        expect(userActions.fetchCurrentUser).toHaveBeenCalledWith(sinon.match({
          orgGuid: 'orgGuid',
          spaceGuid: 'spaceGuid'
        }));
      });
    });

    describe('given an error', function () {
      let next, error;

      beforeEach(function (done) {
        next = sandbox.spy(done);
        error = new Error('network error');
        LoginStore._error = error;
        loginActions.fetchStatus.returns(Promise.resolve(null));
        sandbox.stub(errorActions, 'noticeError').returns(Promise.resolve());

        checkAuth(next);
      });

      afterEach(function () {
        LoginStore._error = null;
      });

      it('calls next', function () {
        expect(next).toHaveBeenCalledOnce();
      });

      it('calls fetchStatus', function () {
        expect(loginActions.fetchStatus).toHaveBeenCalledOnce();
      });

      it('fetches page data', function () {
        expect(userActions.fetchCurrentUser).toHaveBeenCalledOnce();
        expect(orgActions.fetchAll).toHaveBeenCalledOnce();
        expect(spaceActions.fetchAll).toHaveBeenCalledOnce();
      });

      it('calls noticeError action', function () {
        expect(errorActions.noticeError).toHaveBeenCalledWith(error);
      });
    });

    describe('given unauthorized response', function () {
      let next;

      beforeEach(function (done) {
        next = sandbox.spy(done);
        sandbox.stub(ReactDOM, 'render');
        sandbox.stub(windowUtil, 'redirect');
        loginActions.fetchStatus.returns(Promise.resolve({ status: 'unauthorized' }));

        checkAuth(next);
      });

      it('halts the page load', function () {
        expect(next).toHaveBeenCalledWith(false);
      });

      it('redirects to /handshake', function () {
        expect(windowUtil.redirect).toHaveBeenCalledWith('/handshake');
      });

      it('renders a loader', function () {
        expect(ReactDOM.render).toHaveBeenCalledOnce();
      });

      it('does not fetch page data', function () {
        expect(userActions.fetchCurrentUser).not.toHaveBeenCalled();
        expect(orgActions.fetchAll).not.toHaveBeenCalled();
        expect(spaceActions.fetchAll).not.toHaveBeenCalled();
      });
    });
  });
});
