
import '../../global_setup.js';

import AppDispatcher from '../../../dispatcher.js';
import cfApi from '../../../util/cf_api.js';
import { wrapInRes, unwrapOfRes } from '../helpers.js';
import OrgStore from '../../../stores/org_store.js';
import { orgActionTypes } from '../../../constants';

describe('OrgStore', () => {
  var sandbox;

  beforeEach(() => {
    OrgStore._data = [];
    OrgStore._currentOrgGuid = null;
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor()', () => {
    it('should set _data to empty array', () => {
      expect(OrgStore._data).toBeEmptyArray();
    });
  });

  describe('get currentOrgGuid', function() {
    it('should start with null, none selected', function() {
      expect(OrgStore.currentOrgGuid).toBe(null);
    });

    it('should return the current org its on', function() {
      var expected = 'asdlfkja;';
      OrgStore._currentOrgGuid = expected;
      expect(OrgStore.currentOrgGuid).toEqual(expected);
    });
  });

  describe('on orgs received', () => {
    it('should set data to passed in orgs', () => {
      var expected = wrapInRes([{guid: '1as'}, {guid: '2as'}]);
      expect(OrgStore.getAll()).toBeArray();

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_RECEIVED,
        orgs: expected
      });

      expect(OrgStore.getAll().length).toEqual(2);
      expect(OrgStore.getAll()).toEqual(unwrapOfRes(expected));
    });

    it('should emit a change event', () => {
      var spy = sandbox.spy(OrgStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_RECEIVED,
        orgs: []
      });

      expect(spy).toHaveBeenCalledOnce();
    });
    
    it('should merge data with existing orgs', () => {
      var updates = wrapInRes([{guid: 'aaa1', name: 'sue'}, 
            {guid: 'aaa2', name: 'see'}]),
          current = [{guid: 'aaa1', memory: 1024}];

      OrgStore._data = current;
      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORGS_RECEIVED,
        orgs: updates
      });

      expect(OrgStore.getAll().length).toEqual(2);
      let actual = OrgStore.get('aaa1');
      expect(actual).toBeTruthy();
      expect(actual.name).toEqual('sue');
      expect(actual.memory).toEqual(1024);
    });
  });

  describe('on org fetch', function() {
    it('should call the api org fetch function', function() {
      var spy = sandbox.spy(cfApi, 'fetchOrg'),
          expected = 'xsfewq';

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORG_FETCH,
        orgGuid: expected
      });

      expect(spy).toHaveBeenCalledOnce();
      let arg = spy.getCall(0).args[0];
      expect(arg).toEqual(expected);
    });
  });

  describe('on org received', function() {
    it('should emit a change event', function() {
      var spy = sandbox.spy(OrgStore, 'emitChange');

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORG_RECEIVED,
        org: { guid: 'asdf' }
      });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should ensure org passed in has data added to it', () => {
      var testGuid = 'xaaddf',
          expected = {
            guid: testGuid,
            name: 'orgA',
            spaces: [
              { guid: 'xaaddf1', name: 'spaceA'},
              { guid: 'xaaddf2', name: 'spaceB'}
            ]
          };

      OrgStore._data = [
        { guid: testGuid, spaceUrl: 'https://space' }
      ];
      expect(OrgStore.get(testGuid)).toBeObject();

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORG_RECEIVED,
        org: expected
      });

      expect(OrgStore._data[0].guid).toEqual(expected.guid);
      expect(OrgStore._data[0].spaces).toEqual(expected.spaces);
    });
  });

  describe('on org change current', function() {
    it('should emit a change event if it finds the org', function() {
      var spy = sandbox.spy(OrgStore, 'emitChange'),
          expected = { guid: 'sdsf', name: 'testA' };

      OrgStore._data.push(expected);

      AppDispatcher.handleViewAction({
        type: orgActionTypes.ORG_CHANGE_CURRENT,
        orgGuid: expected.guid
      });

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
