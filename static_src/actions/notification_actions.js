
/*
 * Actions for global notifications across the whole application.
 */

import AppDispatcher from '../dispatcher.js';
import { notificationActionTypes } from '../constants';

/* eslint-disable no-alert, no-console */
export default {
  createNotification(notice, msg) {
    AppDispatcher.handleUIAction({
      type: notificationActionTypes.NOTIFY,
      notice,
      msg
    });

    return Promise.resolve(notice);
  },

  clearNotifications() {
    AppDispatcher.handleUIAction({
      type: notificationActionTypes.CLEAR
    });

    return Promise.resolve();
  }
};
/* eslint-enable no-alert, no-console */
