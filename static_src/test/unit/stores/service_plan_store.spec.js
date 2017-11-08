import "../../global_setup.js";

import Immutable from "immutable";

import AppDispatcher from "../../../dispatcher.js";
import cfApi from "../../../util/cf_api.js";
import { ServicePlanStore as ServicePlanStoreClass } from "../../../stores/service_plan_store.js";
import serviceActions from "../../../actions/service_actions.js";
import { serviceActionTypes } from "../../../constants.js";

describe("ServicePlanStore", function() {
  let sandbox, ServicePlanStore;

  beforeEach(() => {
    ServicePlanStore = new ServicePlanStoreClass();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("constructor()", () => {
    it("should set _data to empty array", () => {
      expect(ServicePlanStore.getAll()).toBeEmptyArray();
    });
  });

  describe("getAllFromService()", function() {
    it("should only return servicePlans with the correct service guid", function() {
      var expectedServiceGuid = "alkdsfjxcvzmcnvqsdxf";
      let expectedServices = [
        { service_guid: expectedServiceGuid, guid: "zvcxklz" },
        { service_guid: expectedServiceGuid, guid: "zcvzcxvzzv" }
      ];
      let unexpectedService = { service_guid: "zxklcjv", guid: "qwpoerui" };

      ServicePlanStore._data = Immutable.fromJS(expectedServices);
      ServicePlanStore.push(unexpectedService);

      let actual = ServicePlanStore.getAllFromService(expectedServiceGuid);

      expect(actual.length).toEqual(2);
      expect(actual).toEqual(expectedServices);
    });
  });

  describe("getCost()", function() {
    it("should return 0 if any part of data is missing", function() {
      let serviceInstance = {};
      let actual = ServicePlanStore.getCost(serviceInstance);
      expect(actual).toEqual(0);

      serviceInstance = {
        extra: {}
      };
      actual = ServicePlanStore.getCost(serviceInstance);
      expect(actual).toEqual(0);

      serviceInstance = {
        extra: { costs: [{}] }
      };
      actual = ServicePlanStore.getCost(serviceInstance);
      expect(actual).toEqual(0);
    });

    it("should return number if found", function() {
      const cost = 10.23343;
      let serviceInstance = {
        extra: { costs: [{ amount: { usd: cost } }] }
      };
      let actual = ServicePlanStore.getCost(serviceInstance);
      expect(actual).toEqual(cost);
    });
  });

  describe("on service plans fetch", function() {
    beforeEach(function() {
      sandbox.spy(ServicePlanStore, "emitChange");

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_PLANS_FETCH,
        serviceGuid: "1234"
      });
    });

    it("should set loading to true", function() {
      expect(ServicePlanStore.loading).toEqual(true);
    });

    it("should emit a change", function() {
      expect(ServicePlanStore.emitChange).toHaveBeenCalledOnce();
    });
  });

  describe("on service plans fetch", function() {
    it("should call the cf api for all service plans belonging to the service", function() {
      var spy = sandbox.spy(cfApi, "fetchAllServicePlans"),
        expectedServiceGuid = "zxncvz8xcvhn32";

      serviceActions.fetchAllPlans(expectedServiceGuid);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expectedServiceGuid);
    });
  });

  describe("on service plans received", function() {
    it("should merge the passed in service plans to current data", function() {
      var expected = [
        { guid: "zxvcjz", name: "zxkjv" },
        { guid: "3981f", name: "adlfskzxcv" }
      ];
      let existing = { guid: "alkdjsfzxcv" };

      let testRes = expected;
      ServicePlanStore.push(existing);

      serviceActions.receivedPlans(testRes);

      let actual = ServicePlanStore.getAll();

      expect(actual.length).toEqual(3);
      actual = ServicePlanStore.get(expected[0].guid);
      expect(actual).toEqual(expected[0]);
    });

    it("should set loading state false", function() {
      sandbox.spy(ServicePlanStore, "emitChange");
      ServicePlanStore._fetchAll = true;

      AppDispatcher.handleViewAction({
        type: serviceActionTypes.SERVICE_PLANS_RECEIVED,
        servicePlans: []
      });

      expect(ServicePlanStore.loading).toBe(false);
    });
  });
});
