
import TestUtils from 'react/lib/ReactTestUtils';

Function.prototype.bind = Function.prototype.bind || function (thisp) {
  var fn = this;
  return function () {
    return fn.apply(thisp, arguments);
  };
};
