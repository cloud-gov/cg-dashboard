
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import { assertAction, setupViewSpy, setupServerSpy } from '../helpers.js';
import cfApi from '../../../util/cf_api.js';
import spaceActions from '../../../actions/space_actions.js';
import { spaceActionTypes } from '../../../constants.js';

describe('spaceActions', () => {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetch()', () => {
    it('should call apis fetch method', () => {
      var spy = sandbox.spy(cfApi, 'fetchSpace'),
          expected = 'abc1';

      spaceActions.fetch(expected);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(expected);
    });

    it('should dispatch a view event of type space fetch', () => {
      let spy = setupViewSpy(sandbox);

      spaceActions.fetch();

      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(spaceActionTypes.SPACE_FETCH);
    });
  });

  describe('receivedSpace()', () => {
    it('should dispatch server event of type space received', () => {
      var expected = { guid: 'asdf' },
          spy = setupServerSpy(sandbox),
          expectedParams = {
            space: expected
          };

      spaceActions.receivedSpace(expected);

      assertAction(spy, spaceActionTypes.SPACE_RECEIVED, expectedParams);
    });
  });
});
