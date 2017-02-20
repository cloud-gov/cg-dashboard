
/*
 * Actions for global errors across the whole application.
 */

import AppDispatcher from '../dispatcher.js';
import { errorActionTypes } from '../constants';
import cfApi from '../util/cf_api.js';

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

  importantDataFetchError(err, entityMessage) {
    let msg = 'Page failed to load, please try again';

    if (entityMessage) {
      msg = `Page failed to load, ${entityMessage}, please try again`;
    }

    AppDispatcher.handleServerAction({
      type: errorActionTypes.IMPORTANT_FETCH,
      msg,
      err
    });
  }
};
/* eslint-enable no-alert, no-console */
