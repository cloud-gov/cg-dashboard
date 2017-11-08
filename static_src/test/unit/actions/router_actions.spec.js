import "../../global_setup";
import React from "react";
import { assertAction, setupViewSpy } from "../helpers";
import routerActions from "../../../actions/router_actions";
import { routerActionTypes } from "../../../constants";

describe("routerActions", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("navigate()", () => {
    it("dispatches `NAVIGATE` action and passes a component and props", () => {
      const props = { some: "data" };
      const component = () => <div />;
      const expected = { component, props };
      const spy = setupViewSpy(sandbox);

      routerActions.navigate(component, props);

      assertAction(spy, routerActionTypes.NAVIGATE, expected);
    });
  });
});
