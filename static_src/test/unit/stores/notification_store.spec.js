
import '../../global_setup.js';

import notificationActions from '../../../actions/notification_actions.js';
import { NotificationStore as NotificationStoreClass } from '../../../stores/notification_store.js';

describe('NotificationStore', function () {
  let NotificationStore, sandbox;

  beforeEach(() => {
    NotificationStore = new NotificationStoreClass();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    NotificationStore.unsubscribe();
    sandbox.restore();
  });

  describe('constructor()', function () {
    it('should start data as empty array', function () {
      expect(NotificationStore.getAll()).toBeEmptyArray();
    });
  });

  describe('on CLEAR', () => {
    let spy;
    let storeNotifications;
    const existingErr = { code: 1122 };

    beforeEach(() => {
      NotificationStore.push(existingErr);

      spy = sandbox.spy(NotificationStore, 'emitChange');

      notificationActions.clearNotifications();

      storeNotifications = NotificationStore.getAll();
    });

    it('should remove the notification if it exists', () => {
      expect(storeNotifications.length).toEqual(0);
    });

    it('should emit a change', () => {
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
