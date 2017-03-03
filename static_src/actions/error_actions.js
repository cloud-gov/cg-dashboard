
/*
 * Actions for global errors across the whole application.
 */

import AppDispatcher from '../dispatcher.js';
import { errorActionTypes } from '../constants';

/* eslint-disable no-alert, no-console */
export default {
  errorDelete(err) {
    console.error('delete failure', err);
    // throw err;
  },

  errorFetch(err) {
    console.error('fetch failure', err);
    // throw err;
  },

  errorPost(err) {
    console.error('post failure', err);
    // throw err;
  },

  errorPut(err) {
    console.error('put failure', err);
    // throw err;
  },

  dismissError(err) {
    AppDispatcher.handleUIAction({
      type: errorActionTypes.DISMISS,
      err
    });

    return Promise.resolve(err);
  },

  importantDataFetchError(err, entityMessage) {
    let msg = 'Connection issue, please try again';

    if (entityMessage) {
      msg = `Connection issue, ${entityMessage}`;
    }

    AppDispatcher.handleServerAction({
      type: errorActionTypes.IMPORTANT_FETCH,
      msg,
      err
    });
  }
};
/* eslint-enable no-alert, no-console */
