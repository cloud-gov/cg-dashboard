// Use a semaphore to track requests in flight
// https://en.wikipedia.org/wiki/Semaphore_(programming)
import { EventEmitter } from "events";

class LoadingStatus extends EventEmitter {
  constructor() {
    super();
    this.requestCount = 0; // Our semaphore
    this.isInitialized = false; // Initialize on first load
  }

  get isLoaded() {
    // We are loaded when we are initialized and no requests are in flight
    return this.isInitialized && !this.requestCount;
  }

  doAddRequest(promise) {
    // Increment the semaphore, requests in flight
    this.requestCount++;

    // On complete, decrement the semaphore
    const onComplete = result => {
      this.requestCount--;

      if (this.isLoaded) {
        this.emit("loaded");
      }

      return result;
    };

    promise.then(onComplete, onComplete);
  }

  load(promises) {
    promises.forEach(promise => {
      this.doAddRequest(promise);
    });

    this.isInitialized = true;
    if (promises.length) {
      this.emit("loading");
    }
  }
}

export default LoadingStatus;
