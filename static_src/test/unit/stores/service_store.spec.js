import Immutable from "immutable";

import "../../global_setup.js";

import AppDispatcher from "../../../dispatcher.js";
import { ServiceStore as ServiceStoreClass } from "../../../stores/service_store.js";
import { serviceActionTypes } from "../../../constants.js";

describe("ServiceStore", function() {
  let sandbox, ServiceStore;

  beforeEach(() => {
    ServiceStore = new ServiceStoreClass();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("on services fetch", function() {
    it("should set loading to true", function() {
      const guid = "zxncvz8xcvhn32";
      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICES_FETCH,
        orgGuid: guid
      });

      expect(ServiceStore.loading).toEqual(true);
    });
  });

  describe("on services received", function() {
    beforeEach(function() {
      const sharedGuid = "adxvcbxv";
      const expected = [
        { guid: "zxvcjz", name: "zxkjv" },
        { guid: sharedGuid, name: "adlfskzxcv" }
      ];

      const testRes = expected;
      ServiceStore.storeData = Immutable.fromJS([{ guid: sharedGuid }]);
      sandbox.spy(ServiceStore, "emitChange");

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICES_RECEIVED,
        services: testRes
      });
    });

    it("should merge in services to current data", function() {
      const services = ServiceStore.getAll();
      expect(services.length).toEqual(2);
    });

    it("should emit a change event", function() {
      expect(ServiceStore.emitChange).toHaveBeenCalledOnce();
    });
  });
});
