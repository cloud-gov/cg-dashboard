
/*
 * Actions for global errors across the whole application.
 */

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
  }
};
/* eslint-enable no-alert, no-console */
