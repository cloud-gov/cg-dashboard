import Immutable from "immutable";

import "../../global_setup.js";

import AppDispatcher from "../../../dispatcher.js";
import cfApi from "../../../util/cf_api.js";
import QuotaStore from "../../../stores/quota_store.js";
import { quotaActionTypes } from "../../../constants";

describe("QuotaStore", function() {
  var sandbox;

  beforeEach(() => {
    QuotaStore.storeData = Immutable.List();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("constructor()", function() {
    it("should start data as empty array", function() {
      expect(QuotaStore.getAll()).toBeEmptyArray();
    });
  });

  describe("on ORGS_QUOTAS_FETCH", function() {
    it("should fetch quotas for all organizations", function() {
      var spy = sandbox.spy(cfApi, "fetchOrgsQuotas");
      AppDispatcher.handleViewAction({
        type: quotaActionTypes.ORGS_QUOTAS_FETCH
      });
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("on ORGS_QUOTAS_RECEIVED", function() {
    it("should call mergeMany with new quotas", function() {
      var spy = sandbox.spy(QuotaStore, "mergeMany");
      var quotas = [
        {
          metadata: {
            guid: "fake-guid"
          },
          entity: {}
        }
      ];
      AppDispatcher.handleViewAction({
        type: quotaActionTypes.ORGS_QUOTAS_RECEIVED,
        quotas
      });
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("on SPACES_QUOTAS_FETCH", function() {
    it("should fetch quotas for all organizations", function() {
      var spy = sandbox.spy(cfApi, "fetchSpacesQuotas");
      AppDispatcher.handleViewAction({
        type: quotaActionTypes.SPACES_QUOTAS_FETCH
      });
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("on SPACES_QUOTAS_RECEIVED", function() {
    it("should call mergeMany with new quotas", function() {
      var spy = sandbox.spy(QuotaStore, "mergeMany");
      var quotas = [
        {
          metadata: {
            guid: "fake-guid"
          },
          entity: {}
        }
      ];
      AppDispatcher.handleViewAction({
        type: quotaActionTypes.SPACES_QUOTAS_RECEIVED,
        quotas
      });
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
