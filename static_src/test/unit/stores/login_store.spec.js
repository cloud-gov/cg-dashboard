
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import LoginStore from '../../../stores/login_store.js';
import { loginActionTypes } from '../../../constants';

describe('LoginStore', () => {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    LoginStore._isAuthenticated = false;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set isLoggedIn to false', () => {
      expect(LoginStore.isLoggedIn()).toBe(false);
    });
  });

  describe('on received status', function() {
    it('should emit a change event', function() {
      var spy = sinon.spy();

      LoginStore.addChangeListener(spy);
      AppDispatcher.handleServerAction({
        type: loginActionTypes.RECEIVED_STATUS,
        status: true
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should set isLoggedIn to true if logged in', function() {
      expect(LoginStore.isLoggedIn()).toBe(false);
      AppDispatcher.handleServerAction({
        type: loginActionTypes.RECEIVED_STATUS,
        status: true
      });

      expect(LoginStore.isLoggedIn()).toBe(true);
    });

    it('should set authenticated to false if false returned', function() {
      expect(LoginStore.isLoggedIn()).toBe(false);
      AppDispatcher.handleServerAction({
        type: loginActionTypes.RECEIVED_STATUS,
        status: false
      });

      expect(LoginStore.isLoggedIn()).toBe(false);
    });
  });
});
