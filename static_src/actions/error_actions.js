
/*
 * Actions for global errors across the whole application.
 */

import errorActionTypes from '../constants.js';
import Dispatcher from '../dispatcher.js';

export default {
  errorDelete(err) {
    console.error('delete failure', err);
    throw err;
  },

  errorFetch(err) {
    console.error('fetch failure', err);
    throw err;
  },

  errorPost(err) {
    console.error('post failure', err);
    throw err;
  },

  errorPut(err) {
    console.error('put failure', err);
    throw err;
  }
};
