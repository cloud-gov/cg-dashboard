import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import orgActions from '../../../actions/org_actions.js';
import { orgActionTypes } from '../../../constants.js';

describe('orgActions', () => {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchAll()', () => {
    it('should call apis fetch method', () => {
      var spy = sandbox.spy(cfApi, 'fetchOrgs');

      orgActions.fetchAll();

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should dispatch a view event of type orgs fetch', () => {
      var spy = sandbox.spy(AppDispatcher, 'handleViewAction');

      orgActions.fetchAll();

      let arg = spy.getCall(0).args[0];
      expect(arg.type).toEqual(orgActionTypes.ORGS_FETCH);
    });
  });
});
