
import '../../global_setup.js';

import BaseStore from '../../../stores/base_store.js';

describe('BaseStore', () => {
  var sandbox,
      store;

  beforeEach(() => {
    store = new BaseStore();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('subscribe()', function() {
    it('it should set the dispatch token to an app dispatcher register',
        function() {

    });
  });

  describe('get dispatchToken()', function() {
    it('should return the hidden dispatch token', function() {
      var expected = {};

      store._dispatchToken = expected;

      expect(store.dispatchToken).toEqual(expected);
    });
  });

  describe('emitChange()', function() {
    it('should emit an event with string CHANGE', function() {
      var spy = sandbox.spy();

      store.on('CHANGE', spy);

      store.emitChange();

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('addChangeListener()', function() {
    it('should add a listener on CHANGE with the callback passed', function() {
      var spy = sandbox.spy();

      store.addChangeListener(spy);

      store.emit('CHANGE');

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('removeChangeListener()', function() {
    it('should remove a listener of type CHANGE with callback passed',
        function() {
      var spy = sandbox.spy();

      store.addChangeListener(spy);
      store.removeChangeListener(spy);

      store.emit('CHANGE');

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('get()', function() {
    it('should get an entity by guid if it exists', function() {
      var expectedGuid = 'adkfjlzcxv',
          expected = { guid: expectedGuid };

      store._data.push(expected);

      let actual = store.get(expectedGuid);

      expect(actual).toEqual(expected);
    });
    
    it('should returned undefined if entity with guid it doesn\'t exist',
        function() {
      store._data = [];
      let actual = store.get('adjlfk');

      expect(actual).toBe(undefined);
    });
  });

  describe('getAll()', function() {
    it('should get all entities if there are some', function() {
      var expected = [{ guid: 'adf' }, { guid: 'adsfjk' }];

      store._data = expected;

      let actual = store.getAll();

      expect(actual).toBeTruthy();
      expect(actual.length).toEqual(2);
      expect(actual).toEqual(expected);
    });

    it('should return an empty array if there are no entities', function() {
      store._data = [];

      let actual = store.getAll();

      expect(actual).toBeEmptyArray();
    });
  });
});
