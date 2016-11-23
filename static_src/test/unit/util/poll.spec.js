
import '../../global_setup.js';

import poll from '../../../util/poll';

describe('poll()', function() {
  const condition = function condition(x) { return !!x; };
  let promise;
  let request;

  beforeEach(function() {
    request = function() {
      return new Promise(function(resolve, reject) {
        promise = {resolve, reject};
      });
    }
  });

  it('should resolve returned promise when condition is true', function(done) {
    let value;
    const actual = poll(condition, request, 0, 1);
    actual.then((res) => value = res);
    promise.resolve(true);

    setImmediate(function() {
      expect(value).toEqual(true);
      done();
    });
  });

  it('should re-send the promise if the condition is false', function() {
    // TODO not sure how to test
  });

  it('should reject returned promise if timeout reached', function(done) {
    let value;
    const actual = poll(condition, request, 1, 0);
    actual.catch((res) => value = res);
    promise.resolve(false);

    setImmediate(function() {
      expect(value instanceof Error).toBeTruthy();
      done();
    });
  });
});
