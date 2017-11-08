import "../../global_setup.js";

import LoadingStatus from "../../../util/loading_status";

describe("LoadingStatus", function() {
  let loadingStatus;

  describe("initial state", function() {
    beforeEach(function() {
      loadingStatus = new LoadingStatus();
    });

    it("is not initialized", function() {
      expect(loadingStatus._initialized).toBe(false);
    });

    it("has zero requests in flight", function() {
      expect(loadingStatus._requests).toBe(0);
    });

    it("is not loaded", function() {
      expect(loadingStatus.isLoaded).toBe(false);
    });
  });

  describe("given some requests", function() {
    let first, second;

    beforeEach(function() {
      loadingStatus = new LoadingStatus();

      const promises = [
        new Promise(function(resolve, reject) {
          // Save for later
          first = { resolve, reject };
        }),
        new Promise(function(resolve, reject) {
          // Save for later
          second = { resolve, reject };
        })
      ];

      loadingStatus.load(promises);
    });

    it("is initialized", function() {
      expect(loadingStatus._initialized).toBe(true);
    });

    it("has two requests in flight", function() {
      expect(loadingStatus._requests).toBe(2);
    });

    it("is not loaded after the first promise", function(done) {
      first.resolve();

      setImmediate(function() {
        expect(loadingStatus.isLoaded).toBe(false);
        done();
      });
    });

    it("is loaded after the second promise", function(done) {
      first.resolve();
      second.resolve();

      setImmediate(function() {
        expect(loadingStatus.isLoaded).toBe(true);
        done();
      });
    });

    it("is independent of order", function(done) {
      second.resolve();
      first.resolve();

      setImmediate(function() {
        expect(loadingStatus.isLoaded).toBe(true);
        done();
      });
    });

    it("is loaded even on failed requests", function(done) {
      first.resolve();
      second.reject();

      setImmediate(function() {
        expect(loadingStatus.isLoaded).toBe(true);
        done();
      });
    });

    it("only counts a promise once", function(done) {
      first.resolve();
      first.resolve();

      setImmediate(function() {
        expect(loadingStatus.isLoaded).toBe(false);
        done();
      });
    });
  });

  describe("events", function() {
    describe("with no requests", function() {
      let loading, loaded;

      beforeEach(function(done) {
        loadingStatus = new LoadingStatus();

        loading = sinon.spy();
        loaded = sinon.spy();

        loadingStatus.on("loading", loading);
        loadingStatus.on("loaded", loaded);

        loadingStatus.load([]);
        setImmediate(done);
      });

      it("does not emit any events", function() {
        expect(loading).not.toHaveBeenCalled();
        expect(loaded).not.toHaveBeenCalled();
      });
    });

    describe("with a request", function() {
      let request, promise, loading, loaded;

      beforeEach(function(done) {
        loadingStatus = new LoadingStatus();
        promise = new Promise(function(resolve, reject) {
          request = { resolve, reject };
        });

        loading = sinon.spy();
        loaded = sinon.spy();

        loadingStatus.on("loading", loading);
        loadingStatus.on("loaded", loaded);

        loadingStatus.load([promise]);
        setImmediate(done);
      });

      describe("load function", function() {
        it("emits `loading`", function() {
          expect(loading).toHaveBeenCalledOnce();
        });

        it("has not emitted `loaded`", function() {
          expect(loaded).not.toHaveBeenCalled();
        });
      });

      describe("when the request resolves", function() {
        beforeEach(function(done) {
          promise.then(done);
          request.resolve();
        });

        it("emits `loaded`", function() {
          expect(loaded).toHaveBeenCalledOnce();
        });
      });

      describe("when the request is rejected", function() {
        beforeEach(function(done) {
          promise.catch(() => done());
          request.reject();
        });

        it("emits `loaded`", function() {
          expect(loaded).toHaveBeenCalledOnce();
        });
      });
    });
  });

  describe("chaining promises", function() {
    let request, promise;

    beforeEach(function() {
      loadingStatus = new LoadingStatus();
      promise = new Promise(function(resolve, reject) {
        request = { resolve, reject };
      });

      loadingStatus.load([promise]);
    });

    describe("given request is resolved", function() {
      let sentinel, fulfillment;

      beforeEach(function(done) {
        sentinel = {};
        fulfillment = sinon.spy();
        promise.then(fulfillment);
        promise.then(() => done());

        request.resolve(sentinel);
      });

      it("is loaded", function() {
        expect(loadingStatus.isLoaded).toBe(true);
      });

      it("calls fulfillment with result of the request", function() {
        expect(fulfillment).toHaveBeenCalledWithExactly(sentinel);
      });
    });

    describe("given request is rejected", function() {
      let sentinel, rejection;

      beforeEach(function(done) {
        sentinel = {};
        rejection = sinon.spy();
        promise.catch(rejection);
        promise.catch(() => done());

        request.reject(sentinel);
      });

      it("is loaded", function() {
        expect(loadingStatus.isLoaded).toBe(true);
      });

      it("calls rejection with result of the request", function() {
        expect(rejection).toHaveBeenCalledWithExactly(sentinel);
      });
    });
  });
});
