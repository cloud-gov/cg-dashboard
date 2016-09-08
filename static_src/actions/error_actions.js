
/*
 * Actions for global errors across the whole application.
 */

import analytics from '../util/analytics.js';
import errorActionTypes from '../constants.js';
import Dispatcher from '../dispatcher.js';

export default {
  errorDelete(err) {
    console.error('delete failure', err);
    analytics.noticeError(err);
    // throw err;
  },

  errorFetch(err) {
    console.error('fetch failure', err);
    analytics.noticeError(err);
    // throw err;
  },

  errorPost(err) {
    console.error('post failure', err);
    analytics.noticeError(err);
    // throw err;
  },

  errorPut(err) {
    console.error('put failure', err);
    analytics.noticeError(err);
    // throw err;
  }
};
