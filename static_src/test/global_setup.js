/* eslint-disable jasmine/no-global-setup,no-console */
require('babel-polyfill');

import jasmineEnzyme from 'jasmine-enzyme';
import UserStore from '../stores/user_store';

Function.prototype.bind = Function.prototype.bind || function (thisp) {
  var fn = this;
  return function () {
    return fn.apply(thisp, arguments);
  };
};

var messageFactories = {
  spy: function(txt) {
    return function(pass, spy) {
      return messageUtils.expectedSpy(pass, spy, txt) + '.';
    };
  },
  spyWithCallCount: function(txt) {
    return function(pass, spy, otherArgs) {
      return messageUtils.expectedSpy(pass, spy, txt) + '. ' +
        messageUtils.callCount(spy) + '.';
    };
  },
  spyWithOtherArgs: function(txt) {
    return function(pass, spy, otherArgs) {
      return messageUtils.expectedSpy(pass, spy, txt) + ' ' +
        messageUtils.otherArgs(otherArgs);
    };
  }
};

var messageUtils = {
  expectedSpy: function(pass, spy, txt) {
    var not = (pass ? 'not ' : '');
    var printf = spy.printf || sinon.spy.printf;
    return printf.call(spy, 'Expected spy "%n" %1%2', not, txt);
  },
  callCount: function(spy) {
    var printf = spy.printf || sinon.spy.printf;
    return printf.call(spy, '"%n" was called %c');
  },
  otherArgs: function(otherArgs) {
    if (!otherArgs || !otherArgs.length) {
      return '';
    } else if (otherArgs.length > 1) {
      return jasmine.pp(otherArgs);
    } else {
      return jasmine.pp(otherArgs[0]);
    }
  }
};

var sinonMatchers = [
  {
    sinonName: 'called',
    jasmineName: 'toHaveBeenCalled',
    message: messageFactories.spyWithCallCount('to have been called')
  },
  {
    sinonName: 'calledOnce',
    jasmineName: 'toHaveBeenCalledOnce',
    message: messageFactories.spyWithCallCount('to have been called once')
  },
  {
    sinonName: 'calledTwice',
    jasmineName: 'toHaveBeenCalledTwice',
    message: messageFactories.spyWithCallCount('to have been called twice')
  },
  {
    sinonName: 'calledThrice',
    jasmineName: 'toHaveBeenCalledThrice',
    message: messageFactories.spyWithCallCount('to have been called thrice')
  },
  {
    sinonName: 'calledBefore',
    jasmineName: 'toHaveBeenCalledBefore',
    message: messageFactories.spyWithOtherArgs('to have been called before')
  },
  {
    sinonName: 'calledAfter',
    jasmineName: 'toHaveBeenCalledAfter',
    message: messageFactories.spyWithOtherArgs('to have been called after')
  },
  {
    sinonName: 'calledOn',
    jasmineName: 'toHaveBeenCalledOn',
    message: messageFactories.spyWithOtherArgs('to have been called on')
  },
  {
    sinonName: 'alwaysCalledOn',
    jasmineName: 'toHaveBeenAlwaysCalledOn',
    message: messageFactories.spyWithOtherArgs('to have been always called on')
  },
  {
    sinonName: 'calledWith',
    jasmineName: 'toHaveBeenCalledWith',
    message: messageFactories.spyWithOtherArgs('to have been called with')
  },
  {
    sinonName: 'alwaysCalledWith',
    jasmineName: 'toHaveBeenAlwaysCalledWith',
    message: messageFactories.spyWithOtherArgs('to have been always called with')
  },
  {
    sinonName: 'calledWithExactly',
    jasmineName: 'toHaveBeenCalledWithExactly',
    message: messageFactories.spyWithOtherArgs('to have been called with exactly')
  },
  {
    sinonName: 'alwaysCalledWithExactly',
    jasmineName: 'toHaveBeenAlwaysCalledWithExactly',
    message: messageFactories.spyWithOtherArgs('to have been always called with exactly')
  },
  {
    sinonName: 'calledWithMatch',
    jasmineName: 'toHaveBeenCalledWithMatch',
    message: messageFactories.spyWithOtherArgs('to have been called with match')
  },
  {
    sinonName: 'alwaysCalledWithMatch',
    jasmineName: 'toHaveBeenAlwaysCalledWithMatch',
    message: messageFactories.spyWithOtherArgs('to have been always called with match')
  },
  {
    sinonName: 'calledWithNew',
    jasmineName: 'toHaveBeenCalledWithNew',
    message: messageFactories.spy('to have been called with new')
  },
  {
    sinonName: 'neverCalledWith',
    jasmineName: 'toHaveBeenNeverCalledWith',
    message: messageFactories.spyWithOtherArgs('to have been never called with')
  },
  {
    sinonName: 'neverCalledWithMatch',
    jasmineName: 'toHaveBeenNeverCalledWithMatch',
    message: messageFactories.spyWithOtherArgs('to have been never called with match')
  },
  {
    sinonName: 'threw',
    jasmineName: 'toHaveThrown',
    message: messageFactories.spyWithOtherArgs('to have thrown an error')
  },
  {
    sinonName: 'alwaysThrew',
    jasmineName: 'toHaveAlwaysThrown',
    message: messageFactories.spyWithOtherArgs('to have always thrown an error')
  },
  {
    sinonName: 'returned',
    jasmineName: 'toHaveReturned',
    message: messageFactories.spyWithOtherArgs('to have returned')
  },
  {
    sinonName: 'alwaysReturned',
    jasmineName: 'toHaveAlwaysReturned',
    message: messageFactories.spyWithOtherArgs('to have always returned')
  }
];

function createCustomMatcher(arg, util, customEqualityTesters) {
  return sinon.match(function (val) {
    return util.equals(val, arg, customEqualityTesters);
  });
}

function createMatcher(matcher) {
  var original = jasmine.matchers[matcher.jasmineName];

  return function (util, customEqualityTesters) {
    return {
      compare: function() {
        var sinonProperty, arg, pass;
        var args = [].slice.call(arguments, 0);
        var actual = args[0];

        if (jasmine.isSpy(actual) && original) {
          return original(util, customEqualityTesters).compare.apply(null, args);
        }

        for (var i = 0, len = args.length; i < len; i++) {
          arg = args[i];
          if (arg && (typeof arg.jasmineMatches === 'function' || arg instanceof jasmine.ObjectContaining)) {
            args[i] = createCustomMatcher(arg, util, customEqualityTesters);
          }
        }

        sinonProperty = actual[matcher.sinonName];

        if (typeof sinonProperty === 'function') {
          pass = sinonProperty.apply(actual, args.slice(1));
        } else {
          pass = sinonProperty;
        }

        return {
          pass: pass,
          message: matcher.message(pass, actual, args.slice(1))
        };
      }
    };
  };
}

function createJasmineSinonMatchers(matchers) {
  var matcher, jasmineSinonMatchers = {};
  for (var i = 0, len = matchers.length; i < len; i++) {
    matcher = matchers[i];
    jasmineSinonMatchers[matcher.jasmineName] = createMatcher(matcher);
  }
  return jasmineSinonMatchers;
}

beforeEach(function() {
  jasmineEnzyme();
  jasmine.addMatchers(createJasmineSinonMatchers(sinonMatchers));
  //jasmine.addMatchers(reactMatchers);
});

jasmine.jasmineSinon = {
  messageFactories: messageFactories
};

beforeEach(() => {
  // Any call to console.warn or console.error should fail the test. If
  // console.warn or console.error is expected, they should be stubbed
  // appropriately.
  sinon.stub(console, 'warn').throws(
    new Error(
      `Unexpected call to console.warn during a test. Please add an expectation or fix the test.`
    )
  );
  // TODO enable the same for console.error
  //sinon.stub(console, 'error').throws(
  //  new Error(
  //    `Unexpected call to console.error during a test. Please add an expectation or fix the test.`
  //  )
  //);
});

afterEach(function () {
  console.warn.restore();
  //console.error.restore();
});

// TODO Stub out axios.{get,delete,patch,post,put}, all async calls should be
// stubbed or mocked, otherwise it's an error.

// TODO Stores should have a different singleton strategy so that state can
// be cleared and managed consistently in tests. Currently, all the singleton
// stores are listening to dispatch events, which often cause events to be
// processed twice.
// UserStore is only an issue because the store calls cfApi. cfApi calls should
// be moved to the actions.
UserStore.unsubscribe();
