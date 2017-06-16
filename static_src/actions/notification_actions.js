
/*
 * Actions for global notifications across the whole application.
 */

import AppDispatcher from '../dispatcher.js';
import { notificationActionTypes } from '../constants';

/* eslint-disable no-alert, no-console */
export default {
  notificationDelete(notice) {
    console.error('delete failure', notice);
    // throw err;
  },

  notificationFetch(notice) {
    console.error('fetch failure', notice);
    // throw err;
  },

  notificationPost(notice) {
    console.error('post failure', notice);
    // throw err;
  },

  notificationPut(notice) {
    console.error('put failure', notice);
    // throw err;
  },

  dismissNotification(notice) {
    AppDispatcher.handleUIAction({
      type: notificationActionTypes.DISMISS,
      notice
    });

    return Promise.resolve(notice);
  },

  noticeNotification(notice) {
    AppDispatcher.handleUIAction({
      type: notificationActionTypes.NOTIFY,
      notice
    });

    return Promise.resolve(notice);
  },

  importantDataFetchNotification(err, entityMessage) {
    console.error(notice);

    const msg = 'There was an issue connecting to the dashboard, ' +
      `${entityMessage || 'please try again later.'}`;

    AppDispatcher.handleServerAction({
      type: notificationActionTypes.IMPORTANT_FETCH,
      msg,
      notice
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
