import "../../global_setup.js";

import AppDispatcher from "../../../dispatcher.js";
import { assertAction, setupViewSpy, setupServerSpy } from "../helpers.js";
import domainActions from "../../../actions/domain_actions.js";
import { domainActionTypes } from "../../../constants.js";

describe("domainActions", function() {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("fetch()", function() {
    it("should dispatch a view event of type domain fetch", function() {
      var expectedDomainGuid = "xzzzasdflkjz",
        expectedParams = {
          domainGuid: expectedDomainGuid
        };

      let spy = setupViewSpy(sandbox);

      domainActions.fetch(expectedDomainGuid);

      assertAction(spy, domainActionTypes.DOMAIN_FETCH, expectedParams);
    });
  });

  describe("receivedDomain()", function() {
    it("should dispatch a view event of type domain resceived", function() {
      var expected = { guid: "asdfavcx1z13c5", name: "al.gov" },
        expectedParams = {
          domain: expected
        };

      let spy = setupServerSpy(sandbox);

      domainActions.receivedDomain(expected);

      assertAction(spy, domainActionTypes.DOMAIN_RECEIVED, expectedParams);
    });
  });
});
