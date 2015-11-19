
/*
 * Actions for global errors across the whole application.
 */

import errorActionTypes from '../constants.js';
import Dispatcher from '../dispatcher.js';

export default {
  errorFetch(err) {
    console.error('failure', err);
    // Do nothing
  },
};
