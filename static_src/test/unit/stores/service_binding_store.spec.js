import "../../global_setup.js";

import Immutable from "immutable";

import AppDispatcher from "../../../dispatcher.js";
import cfApi from "../../../util/cf_api.js";
import { ServiceBindingStore as ServiceBindingStoreClass } from "../../../stores/service_binding_store.js";

import { serviceActionTypes } from "../../../constants.js";

describe("ServiceBindingStore", function() {
  let sandbox, ServiceBindingStore;

  beforeEach(() => {
    ServiceBindingStore = new ServiceBindingStoreClass();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    ServiceBindingStore.unsubscribe();
    sandbox.restore();
  });

  describe("on service bindings fetch", function() {
    beforeEach(function() {
      const expectedAppGuid = "zxncvz8xcvhn32";
      sandbox.spy(ServiceBindingStore, "emitChange");

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_BINDINGS_FETCH,
        appGuid: expectedAppGuid
      });
    });

    it("should set loading to true", function() {
      expect(ServiceBindingStore.loading).toEqual(true);
    });

    it("should emit a change", function() {
      expect(ServiceBindingStore.emitChange).toHaveBeenCalledOnce();
    });
  });

  describe("getAllByApp()", function() {
    it("should return all bindings by app guid", function() {
      const appGuid = "zxclvkjzxcvsdf23";
      const bindingA = { guid: "binda", app_guid: appGuid };
      const bindingB = { guid: "bindb", app_guid: appGuid };

      ServiceBindingStore.storeData = Immutable.fromJS([bindingA, bindingB]);

      const actual = ServiceBindingStore.getAllByApp(appGuid);

      expect(actual).toBeTruthy();
      expect(actual.length).toEqual(2);
      expect(actual).toContain(bindingA);
      expect(actual).toContain(bindingB);
    });
  });

  describe("on service bindings received", function() {
    let fakeBindings;

    beforeEach(function() {
      fakeBindings = [
        {
          metadata: { guid: "adsfa" },
          entity: { service_instance_guid: "zcv" }
        }
      ];

      sandbox.spy(ServiceBindingStore, "emitChange");
      sandbox.spy(ServiceBindingStore, "mergeMany");

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_BINDINGS_RECEIVED,
        serviceBindings: fakeBindings
      });
    });

    it("should emit a change", function() {
      expect(ServiceBindingStore.emitChange).toHaveBeenCalledOnce();
    });

    it("should merge many with guid", function() {
      expect(ServiceBindingStore.mergeMany).toHaveBeenCalledOnce();
      expect(ServiceBindingStore.mergeMany).toHaveBeenCalledWith("guid");
    });
  });

  describe("on service unbind", function() {
    it("should binding with state unbinding", function() {
      const spy = sandbox.stub(cfApi, "deleteServiceBinding");
      spy.returns(Promise.resolve({ data: {} }));
      const binding = {
        guid: "zxvadf"
      };

      ServiceBindingStore.push(binding);

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_UNBIND,
        serviceBinding: binding
      });

      const actualBinding = ServiceBindingStore.get(binding.guid);
      expect(actualBinding.unbinding).toBe(true);
    });
  });

  describe("on service bound", function() {
    let bindingGuid, testBinding;

    beforeEach(function() {
      bindingGuid = "xcvm,n32980cvxn";
      testBinding = {
        guid: bindingGuid,
        app_guid: "zcxv32",
        service_instance_guid: "xxcv2133"
      };

      sandbox.spy(ServiceBindingStore, "emitChange");

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_BOUND,
        serviceBinding: testBinding
      });
    });

    it("should add the new binding to the store", function() {
      const expected = testBinding;
      const actual = ServiceBindingStore.get(bindingGuid);

      expect(actual).toBeTruthy();
      expect(actual).toEqual(expected);
    });

    it("should emit a change", function() {
      expect(ServiceBindingStore.emitChange).toHaveBeenCalledOnce();
    });
  });

  describe("on service unbound", function() {
    let testBinding;

    beforeEach(function() {
      testBinding = {
        guid: "2dfg25sd",
        app_guid: "zcvx234xcb",
        service_instance_guid: "zxcv234bvc"
      };

      ServiceBindingStore.storeData = Immutable.fromJS([testBinding]);
      sandbox.spy(ServiceBindingStore, "emitChange");

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_UNBOUND,
        serviceBinding: testBinding
      });
    });

    it("should remove the service binding", function() {
      expect(ServiceBindingStore.get(testBinding.guid)).toBeFalsy();
    });

    it("should emit a change", function() {
      expect(ServiceBindingStore.emitChange).toHaveBeenCalledOnce();
    });

    describe("when service binding not found", function() {
      beforeEach(function() {
        ServiceBindingStore.emitChange.reset();
        AppDispatcher.handleViewAction({
          type: serviceActionTypes.SERVICE_UNBOUND,
          serviceBinding: { guid: "not-exist" }
        });
      });

      it("should do nothing if service binding not found", function() {
        expect(ServiceBindingStore.emitChange).not.toHaveBeenCalledOnce();
      });
    });
  });
});
