import "../../global_setup";
import React from "react";
import sinon from "sinon";
import AppDispatcher from "../../../dispatcher";
import RouterStore from "../../../stores/router_store";
import { routerActionTypes } from "../../../constants";

describe("RouterStore", () => {
  const dispatchNavigationAction = component =>
    AppDispatcher.handleViewAction({
      type: routerActionTypes.NAVIGATE,
      data: {
        component
      }
    });

  describe("instantiation", () => {
    it("sets its routeComponent property", () => {
      expect(RouterStore.routeComponent).toEqual(jasmine.any(Object));
    });
  });

  describe("responding to actions", () => {
    const component = () => <div />;

    it("sets the current route information passed by `NAVIGATE` action", () => {
      dispatchNavigationAction(component);
      expect(RouterStore.component.component).toEqual(component);
    });

    it("emits a change event when it responds to an action", () => {
      const spy = sinon.spy(RouterStore, "emitChange");
      dispatchNavigationAction(component);

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
