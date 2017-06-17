
import '../../global_setup.js';

import { setupUISpy } from '../helpers.js';
import notificationActions from '../../../actions/notification_actions.js';
import { notificationActionTypes } from '../../../constants.js';

describe('notificationActions', function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createNotification()', function () {
    it('should dispatch a server notify event with notification object', () => {
      const notice = 'finish';
      const msg = 'this is a message';
      const dispatchSpy = setupUISpy(sandbox);

      notificationActions.createNotification(notice, msg);

      expect(dispatchSpy).toHaveBeenCalledOnce();
      const dispatch = dispatchSpy.getCall(0).args[0];
      expect(dispatch.type).toEqual(notificationActionTypes.NOTIFY);
    });
  });

  describe('clearNotifications()', function () {
    it('should dispatch a clear event to clear the event', () => {
      const dispatchSpy = setupUISpy(sandbox);

      notificationActions.clearNotifications();

      expect(dispatchSpy).toHaveBeenCalledOnce();
      const dispatch = dispatchSpy.getCall(0).args[0];
      expect(dispatch.type).toEqual(notificationActionTypes.CLEAR);
    });
  });
});
