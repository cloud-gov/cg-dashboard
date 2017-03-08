
import '../../global_setup.js';

import errorActions from '../../../actions/error_actions.js';
import { ErrorStore as ErrorStoreClass } from '../../../stores/error_store.js';

describe('ErrorStore', function () {
  let ErrorStore, sandbox;

  beforeEach(() => {
    ErrorStore = new ErrorStoreClass();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    ErrorStore.unsubscribe();
    sandbox.restore();
  });

  describe('constructor()', function () {
    it('should start data as empty array', function () {
      expect(ErrorStore.getAll()).toBeEmptyArray();
    });
  });

  describe('checkForMaxFetchErrors()', () => {
    describe('on more then max errors', () => {
      let spy;

      beforeEach(() => {
        for (let i = 0; i < 5; i++) {
          ErrorStore.push({ description: `error-${i}` });
        }

        spy = sandbox.spy(ErrorStore, 'emitChange');

        ErrorStore.checkForMaxFetchErrors();
      });

      it('should clear all the data and add one generic error object', () => {
        expect(ErrorStore.getAll().length).toEqual(1);
        expect(ErrorStore.getAll()[0].description).toEqual(
          'Connection issue, please try again');
      });

      it('should emit a change', () => {
        expect(spy).toHaveBeenCalledOnce();
      });
    });

    describe('on less then max errors', () => {
      it('should do nothing', () => {
        const errorAmount = 3;
        for (let i = 0; i < errorAmount; i++) {
          ErrorStore.push({ description: `error-${i}` });
        }
        const spy = sandbox.spy(ErrorStore, 'emitChange');

        ErrorStore.checkForMaxFetchErrors();

        expect(ErrorStore.getAll().length).toEqual(3);
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('on IMPORTANT_FETCH', () => {
    let spy;
    let checkMaxSpy;
    let storeErrors;
    const error = { code: 1024 };
    const specificMessage = 'app had problem';

    beforeEach(() => {
      spy = sandbox.spy(ErrorStore, 'emitChange');
      checkMaxSpy = sandbox.stub(ErrorStore, 'checkForMaxFetchErrors');

      errorActions.importantDataFetchError(error, specificMessage);

      storeErrors = ErrorStore.getAll();
    });

    it('should add the message passed through to the error object and add to store',
    () => {
      expect(storeErrors[0].description).toEqual(
        `There was an issue connecting to dashboard.cloud.gov, ${specificMessage}`);
    });

    it('should emit a change', () => {
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should check for max fetch errors', () => {
      expect(checkMaxSpy).toHaveBeenCalledOnce();
    });
  });

  describe('on DISMISS', () => {
    let spy;
    let storeErrors;
    const existingErr = { code: 1122 };

    beforeEach(() => {
      ErrorStore.push(existingErr);

      spy = sandbox.spy(ErrorStore, 'emitChange');

      errorActions.dismissError(existingErr);

      storeErrors = ErrorStore.getAll();
    });

    it('should remove the error if it exists', () => {
      expect(storeErrors.length).toEqual(0);
    });

    it('should emit a change', () => {
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
