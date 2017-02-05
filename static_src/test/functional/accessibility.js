
require('chromedriver');
const AxeBuilder = require('axe-webdriverjs');
const WebDriver = require('selenium-webdriver');

import { start } from '../server';

let testServer = null;

function before() {
  return new Promise((resolve, reject) => {
    testServer = start(8001, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

function after() {
  return new Promise((resolve, reject) => {
    testServer.stop(err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

const driver = new WebDriver.Builder()
  .forBrowser('chrome')
  .build();

before().then(() => {
  driver
    .get('http://localhost:8001')
    .then(function () {
      AxeBuilder(driver)
        .analyze(function (results) {
          console.log(results);
        });
    }).then(function() {
      after();
      driver.quit();
    });
});


