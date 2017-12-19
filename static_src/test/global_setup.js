/* eslint-disable jasmine/no-global-setup,no-console */
require("babel-polyfill");

import jasmineEnzyme from "jasmine-enzyme";
import LoginStore from "../stores/login_store";
import UserStore from "../stores/user_store";

beforeEach(function() {
  jasmineEnzyme();
});

beforeEach(() => {
  // Any call to console.warn or console.error should fail the test. If
  // console.warn or console.error is expected, they should be stubbed
  // appropriately.
  sinon
    .stub(console, "warn")
    .throws(
      new Error(
        "Unexpected call to console.warn during a test. Please add an expectation or fix the test."
      )
    );
  // TODO enable the same for console.error
});

afterEach(function() {
  console.warn.restore();
});

// TODO Stub out axios.{get,delete,patch,post,put}, all async calls should be
// stubbed or mocked, otherwise it's an error.

// TODO Stores should have a different singleton strategy so that state can
// be cleared and managed consistently in tests. Currently, all the singleton
// stores are listening to dispatch events, which often cause events to be
// processed twice.
// UserStore is only an issue because the store calls cfApi. cfApi calls should
// be moved to the actions.
LoginStore.unsubscribe();
UserStore.unsubscribe();
