const DEFAULT_TIMEOUT = 5 * 60 * 1000; // (ms) 5 minutes
const DEFAULT_INTERVAL = 5 * 1000; // (ms) 5 seconds

export default function poll(
  condition,
  promise,
  interval = DEFAULT_INTERVAL,
  timeout = DEFAULT_TIMEOUT
) {
  const endTime = Date.now() + timeout;

  const check = function _check(resolve, reject) {
    promise().then(res => {
      if (condition(res)) {
        resolve(res);
      } else if (Date.now() < endTime) {
        setTimeout(check, interval, resolve, reject);
      } else {
        reject(new Error("Timed out"));
      }
    });
  };

  return new Promise(check);
}
