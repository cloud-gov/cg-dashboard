
/*
 * Actions for global errors across the whole application.
 */

import errorActionTypes from '../constants.js';
import Dispatcher from '../dispatcher.js';

export default {
  errorDelete(err) {
    console.error('delete failure', err);
  },

  errorFetch(err) {
    console.error('fetch failure', err);
  },

  errorPost(err) {
    console.error('post failure', err);
  },

  errorPut(err) {
    console.error('put failure', err);
  }
};
