
import Immutable from 'immutable';

import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import DomainStore from '../../../stores/domain_store.js';
import { domainActionTypes, routeActionTypes } from '../../../constants';

describe('DomainStore', function() {
  var sandbox;

  beforeEach(() => {
    DomainStore._data = Immutable.List();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', function() {
    it('should start data as empty array', function() {
      expect(DomainStore.getAll()).toBeEmptyArray();
    });
  });

  describe('on domain fetch', function () {
    it('should call call fetchDomain with the domain guid', function () {
      const spy = sandbox.spy(cfApi, 'fetchPrivateDomain');
      const domainGuid = 'fake-domain-guid';

      AppDispatcher.handleViewAction({
        type: domainActionTypes.DOMAIN_FETCH,
        domainGuid
      });

      const arg = spy.getCall(0).args[0];
      expect(spy).toHaveBeenCalledOnce();
      expect(arg).toEqual(domainGuid);
    });
  });

  describe('on domain received', function() {
    it('should merge in the domain', function() {
      const domain = { guid: 'fake-domain-guid', name: '.gov' };

      AppDispatcher.handleServerAction({
        type: domainActionTypes.DOMAIN_RECEIVED,
        domain: wrapInRes([domain])[0]
      });

      const actual = DomainStore.get(domain.guid);

      expect(actual).toEqual(domain);
    });

    it('should emit a change event', function() {
      const spy = sandbox.spy(DomainStore, 'emitChange');
      const domain = { guid: 'fake-domain-guid', name: '.gov' };

      AppDispatcher.handleServerAction({
        type: domainActionTypes.DOMAIN_RECEIVED,
        domain: wrapInRes([domain])[0]
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
