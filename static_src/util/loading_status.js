// Use a semaphore to track requests in flight
// https://en.wikipedia.org/wiki/Semaphore_(programming)
class LoadingStatus {
  constructor() {
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
    const onComplete = () => this._requests--;
    promise.then(onComplete, onComplete);
  }

  load(promises) {
    promises.forEach(promise => {
      this._addRequest(promise);
    });

    this._initialized = true;
  }
}


export default LoadingStatus;
