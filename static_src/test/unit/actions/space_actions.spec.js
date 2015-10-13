
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
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
      var spy = sandbox.spy(AppDispatcher, 'handleViewAction');

      spaceActions.fetch();

      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(spaceActionTypes.SPACE_FETCH);
    });
  });

  describe('receivedSpace()', () => {
    it('should dispatch server event of type space received', () => {
      var spy = sandbox.spy(AppDispatcher, 'handleServerAction'),
          expected = { guid: 'asdf' };

      spaceActions.receivedSpace(expected);

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(spaceActionTypes.SPACE_RECEIVED);
      expect(arg.space).toEqual(expected);
    });
  });
});
