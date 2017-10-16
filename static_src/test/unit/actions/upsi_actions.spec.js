import '../../global_setup';

import { assertAction, setupViewSpy, setupServerSpy } from '../helpers';
import cfApi from '../../../util/cf_api';
import upsiActions, {
  fetchAllSuccess,
  fetchAllFailure,
  fetchAllForSpaceSuccess,
  fetchAllForSpaceFailure
} from '../../../actions/upsi_actions';
import { upsiActionTypes } from '../../../constants';

describe('upsiActions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchAll', () => {
    it('should dispatch a view action and call the API', () => {
      const viewSpy = setupViewSpy(sandbox);
      const apiStub = sandbox
        .stub(cfApi, 'fetchAllUPSI')
        .returns(Promise.resolve([]));

      upsiActions.fetchAll().then(() => {
        assertAction(viewSpy, upsiActionTypes.UPSI_FETCH_ALL_REQUEST);

        expect(apiStub).toHaveBeenCalledOnce();
      });
    });
  });

  describe('fetchAllSuccess', () => {
    it('should dispatch a server action', () => {
      const spy = setupServerSpy(sandbox);
      const items = [{ guid: '1234' }];
      fetchAllSuccess(items).then(() =>
        assertAction(spy, upsiActionTypes.UPSI_FETCH_ALL_SUCCESS, { items })
      );
    });
  });

  describe('fetchAllFailure', () => {
    it('should dispatch a server action', () => {
      const spy = setupServerSpy(sandbox);
      const err = new Error();
      fetchAllFailure(err).then(() =>
        assertAction(spy, upsiActionTypes.UPSI_FETCH_ALL_FAILURE)
      );
    });
  });

  describe('fetchAllForSpace', () => {
    it('should dispatch a view action and call the API', () => {
      const viewSpy = setupViewSpy(sandbox);
      const apiStub = sandbox
        .stub(cfApi, 'fetchAllUPSI')
        .returns(Promise.resolve([]));

      const spaceGuid = 'abcd';

      upsiActions.fetchAllForSpace(spaceGuid).then(() => {
        assertAction(viewSpy, upsiActionTypes.UPSI_FETCH_ALL_FOR_SPACE_REQUEST);

        expect(apiStub).toHaveBeenCalledWith({
          q: [{ filter: 'space_guid', op: ':', value: spaceGuid }]
        });
      });
    });
  });

  describe('fetchAllForSpaceSuccess', () => {
    it('should dispatch a server action', () => {
      const spy = setupServerSpy(sandbox);
      const spaceGuid = 'abcd';
      const items = [{ guid: '1234' }];
      fetchAllForSpaceSuccess(spaceGuid, items).then(() =>
        assertAction(spy, upsiActionTypes.UPSI_FETCH_ALL_FOR_SPACE_SUCCESS, {
          spaceGuid,
          items
        })
      );
    });
  });

  describe('fetchAllForSpaceFailure', () => {
    it('should dispatch a server action', () => {
      const spy = setupServerSpy(sandbox);
      const spaceGuid = 'abcd';
      const err = new Error();
      fetchAllForSpaceFailure(spaceGuid, err).then(() =>
        assertAction(spy, upsiActionTypes.UPSI_FETCH_ALL_FOR_SPACE_FAILURE, {
          spaceGuid
        })
      );
    });
  });
});
