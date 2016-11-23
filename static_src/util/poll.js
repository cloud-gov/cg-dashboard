
const DEFAULT_TIMEOUT = 50000;
const DEFAULT_INTERVAL = 750;

export default function poll(condition, promise,
    interval = DEFAULT_INTERVAL,
    timeout = DEFAULT_TIMEOUT) {
  const endTime = Date.now() + timeout;

  const check = function (resolve, reject) {
    promise().then((res) => {
      if (condition(res)) {
        resolve(res);
      } else if (Date.now() < endTime) {
        setTimeout(check, interval, resolve, reject);
      } else {
        reject(new Error('Timed out'));
      }
    });
  };

  return new Promise(check);
}
