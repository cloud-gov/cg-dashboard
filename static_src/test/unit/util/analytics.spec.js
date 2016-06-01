
import '../../global_setup.js';

import { trackAction, trackPageView } from '../../../util/analytics';

describe('analytics helpers', function () {
  describe('with GA loaded', function () {
    var sandbox;
    var window = (window) ? window : global;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      window.ga = function() { return; }
    });

    afterEach(() => {
      sandbox.restore();
      delete window.ga;
    });

    it('should track action with event', function () {
      var action = {
        source: 'test-source',
        type: 'test-type'
      };
      var expected = {
        hitType: 'event',
        eventCategory: action.source,
        eventAction: action.type
      };
      var spy = sandbox.spy(window, 'ga');

      trackAction(action);

      expect(spy).toHaveBeenCalledWith('send', expected);
    });

    it('should track page view with event', function () {
      var url = 'fake/url/for/testing';
      var expected = {
        hitType: 'pageview',
        page: url
      };
      var spy = sandbox.spy(window, 'ga');

      trackPageView(url);

      expect(spy).toHaveBeenCalledWith('send', expected);
    });
  });
});
