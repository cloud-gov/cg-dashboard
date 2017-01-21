/* eslint-disable jasmine/no-global-setup */
import { start } from '../server';

let testServer = null;

// Using promises here to work around this bug https://github.com/webdriverio/wdio-jasmine-framework/issues/28
beforeAll('start test server', function () {
  return new Promise((resolve, reject) => {
    testServer = start(8001, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
});

afterAll('stop test server', function () {
  return new Promise((resolve, reject) => {
    const timeout = 5000;
    testServer.stop(timeout, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
});
