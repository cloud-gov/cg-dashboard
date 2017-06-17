
import '../../global_setup.js';

import { setupUISpy, setupServerSpy } from '../helpers.js';
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

  describe('dismissNotification()', function () {
    it('should dispatch a server dismiss event with notification object', () => {
      const notification = { description: 'notification' };
      const dispatchSpy = setupUISpy(sandbox);

      notificationActions.dismissNotification(notification);

      expect(dispatchSpy).toHaveBeenCalledOnce();
      const dispatch = dispatchSpy.getCall(0).args[0];
      expect(dispatch.type).toEqual(notificationActionTypes.DISMISS);
      expect(dispatch.notification).toEqual(notification);
    });
  });

  describe('importantDataFetchNotification()', function () {
    let dispatchSpy;
    let dispatch;
    const message = 'app broken';

    beforeEach(() => {
      const notification = { description: 'Server notification' };
      dispatchSpy = setupServerSpy(sandbox);

      notificationActions.importantDataFetchNotification(notification, message);

      dispatch = dispatchSpy.getCall(0).args[0];
    });

    it('should dispatch an important fetch notification server event', () => {
      expect(dispatchSpy).toHaveBeenCalledOnce();
      expect(dispatch.type).toEqual(notificationActionTypes.IMPORTANT_FETCH);
    });

    it('should wrap the supplied notification message with generic messaging', () => {
      expect(dispatch.msg).toEqual(
        `There was an issue connecting to the dashboard, ${message}`);
    });
  });
});
