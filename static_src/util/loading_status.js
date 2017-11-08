// Use a semaphore to track requests in flight
// https://en.wikipedia.org/wiki/Semaphore_(programming)
import { EventEmitter } from "events";

class LoadingStatus extends EventEmitter {
  constructor() {
    super();
    this._requests = 0; // Our semaphore
    this._initialized = false; // Initialize on first load
  }

  get isLoaded() {
    // We are loaded when we are initialized and no requests are in flight
    return this._initialized && !this._requests;
  }

  _addRequest(promise) {
    // Increment the semaphore, requests in flight
    this._requests++;

    // On complete, decrement the semaphore
    const onComplete = result => {
      this._requests--;

      if (this.isLoaded) {
        this.emit("loaded");
      }

      return result;
    };

    promise.then(onComplete, onComplete);
  }

  load(promises) {
    promises.forEach(promise => {
      this._addRequest(promise);
    });

    this._initialized = true;
    if (promises.length) {
      this.emit("loading");
    }
  }
}

export default LoadingStatus;
