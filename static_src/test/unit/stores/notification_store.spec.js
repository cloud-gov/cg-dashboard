
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

  describe('checkForMaxFetchNotifications()', () => {
    describe('on more then max notifications', () => {
      let spy;

      beforeEach(() => {
        for (let i = 0; i < 5; i++) {
          NotificationStore.push({ description: `notification-${i}` });
        }

        spy = sandbox.spy(NotificationStore, 'emitChange');

        NotificationStore.checkForMaxFetchNotifications();
      });

      it('should clear all the data and add one generic notification object', () => {
        expect(NotificationStore.getAll().length).toEqual(1);
        expect(NotificationStore.getAll()[0].description).toEqual(
          'Connection issue, please try again');
      });

      it('should emit a change', () => {
        expect(spy).toHaveBeenCalledOnce();
      });
    });

    describe('on less then max notifications', () => {
      it('should do nothing', () => {
        const notificationAmount = 3;
        for (let i = 0; i < notificationAmount; i++) {
          NotificationStore.push({ description: `notification-${i}` });
        }
        const spy = sandbox.spy(NotificationStore, 'emitChange');

        NotificationStore.checkForMaxFetchNotifications();

        expect(NotificationStore.getAll().length).toEqual(1);
        expect(spy).toHaveBeenCalledOnce();
      });
    });
  });

  describe('on IMPORTANT_FETCH', () => {
    let spy;
    let checkMaxSpy;
    let storeNotifications;
    const notification = { code: 1024 };
    const specificMessage = 'app had problem';

    beforeEach(() => {
      spy = sandbox.spy(NotificationStore, 'emitChange');
      checkMaxSpy = sandbox.stub(NotificationStore, 'checkForMaxFetchNotifications');

      notificationActions.importantDataFetchNotification(notification, specificMessage);

      storeNotifications = NotificationStore.getAll();
    });

    it('should add the message passed through to the notification object and add to store',
    () => {
      expect(storeNotifications[0].description).toEqual(
        `There was an issue connecting to the dashboard, ${specificMessage}`);
    });

    it('should emit a change', () => {
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should check for max fetch notifications', () => {
      expect(checkMaxSpy).toHaveBeenCalledOnce();
    });
  });

  describe('on DISMISS', () => {
    let spy;
    let storeNotifications;
    const existingErr = { code: 1122 };

    beforeEach(() => {
      NotificationStore.push(existingErr);

      spy = sandbox.spy(NotificationStore, 'emitChange');

      notificationActions.dismissNotification(existingErr);

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
