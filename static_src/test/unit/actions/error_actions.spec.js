
import '../../global_setup.js';

import { setupUISpy, setupServerSpy } from '../helpers.js';
import errorActions from '../../../actions/error_actions.js';
import { errorActionTypes } from '../../../constants.js';

describe('errorActions', function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('dismissError()', function () {
    it('should dispatch a server dismiss event with error object', () => {
      const err = { description: 'error' };
      const dispatchSpy = setupUISpy(sandbox);

      errorActions.dismissError(err);

      expect(dispatchSpy).toHaveBeenCalledOnce();
      const dispatch = dispatchSpy.getCall(0).args[0];
      expect(dispatch.type).toEqual(errorActionTypes.DISMISS);
      expect(dispatch.err).toEqual(err);
    });
  });

  describe('importantDataFetchError()', function () {
    let dispatchSpy;
    let dispatch;
    const message = 'app broken';

    beforeEach(() => {
      const err = { description: 'Server error' };
      dispatchSpy = setupServerSpy(sandbox);

      errorActions.importantDataFetchError(err, message);

      dispatch = dispatchSpy.getCall(0).args[0];
    });

    it('should dispatch an important fetch error server event', () => {
      expect(dispatchSpy).toHaveBeenCalledOnce();
      expect(dispatch.type).toEqual(errorActionTypes.IMPORTANT_FETCH);
    });

    it('should wrap the supplied error message with generic messaging', () => {
      expect(dispatch.msg).toEqual(
        `Page failed to load, ${message}, please try again`);
    });
  });
});
