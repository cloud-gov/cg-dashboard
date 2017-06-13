
/*
 * Includes basic functionality that all stores need.
 */

import { EventEmitter } from 'events';
import Immutable from 'immutable';

import AppDispatcher from '../dispatcher.js';
import LoadingStatus from '../util/loading_status.js';

// TODO clean up the listeners and reduce the MAX_LISTENERS to 15
const MAX_LISTENERS = 20;
const MAX_LISTENERS_THRESHOLD = 10;

function defaultChangedCallback(changed) {
  if (changed) this.emitChange();
}

export default class BaseStore extends EventEmitter {

  constructor() {
    super();
    this._loadingStatus = new LoadingStatus();
    this._loadingStatus.on('loading', () => this.emitChange());
    this._loadingStatus.on('loaded', () => this.emitChange());
    this._data = new Immutable.List();
    this._listenerCount = 0;
    this.setMaxListeners(MAX_LISTENERS);
  }

  subscribe(actionSubscribe) {
    this._dispatchToken = AppDispatcher.register(actionSubscribe());
  }

  unsubscribe() {
    AppDispatcher.unregister(this._dispatchToken);
  }

  get dispatchToken() {
    return this._dispatchToken;
  }

  get loading() {
    return !this._loadingStatus.isLoaded;
  }

  isEmpty() {
    if (this._data.count() === 0) return true;
    return false;
  }

  push(val) {
    const newData = Immutable.fromJS(val);
    this._data = this._data.push(newData);
    this.emitChange();

    return this._data;
  }

  get(guid) {
    if (guid && !this.isEmpty()) {
      const item = this._data.find((space) =>
        space.get('guid') === guid
      );

      if (item) return item.toJS();
    }
    return undefined;
  }

  getAll() {
    return this._data.toJS();
  }

  dataHasChanged(toCompare) {
    const c = Immutable.fromJS(toCompare);
    return !Immutable.is(this._data, c);
  }

  delete(guid, cb = defaultChangedCallback.bind(this)) {
    const index = this._data.findIndex((d) =>
      d.get('guid') === guid
    );

    if (index === -1) return cb(false);

    this._data = this._data.delete(index);
    return cb(true);
  }

  clear(cb = defaultChangedCallback.bind(this)) {
    const old = this._data;
    this._data = this._data.clear();
    return cb(!this._data.equals(old));
  }

  formatSplitResponse(resources) {
    return resources.map((r) => Object.assign(r.entity, r.metadata));
  }

  emitChange() {
    this.emit('CHANGE');
  }

  addChangeListener(cb) {
    if (++this._listenerCount > MAX_LISTENERS_THRESHOLD) {
      /* eslint-disable no-console */
      console.warn('listener count is above threshold', {
        store: this.constructor.name,
        count: this._listenerCount
      });
      console.trace();
      /* eslint-enable no-console */
    }

    this.on('CHANGE', cb);
  }

  removeChangeListener(cb) {
    this.removeListener('CHANGE', cb);
    this._listenerCount--;
  }

  load(promises) {
    this._loadingStatus.load(promises);
  }

  /* merge with no side effects
   *
   * If the dataToMerge exists in the store (as found by
   * the mergeKey), then merge in new data if there are
   * changes. If it does not exist in the store, add it.
   * When data changes, calls dataChangedCallback with
   * true as the argument. Otherwise, false is used
   *
   * @param {string} mergeKey - use to match objects
   * @param {object} dataToMerge - new object with data
   * @param {fn} cb - defaults to calling this.emitChange()
   *                  when the store's data has changed
   *
  */
  merge(mergeKey, dataToMerge, cb = defaultChangedCallback.bind(this)) {
    const toMerge = Immutable.fromJS(dataToMerge);
    const oldDataItem = this._data.find((d) =>
      d.get(mergeKey) === toMerge.get(mergeKey)
    );

    if (oldDataItem) {
      if (Immutable.is(oldDataItem, toMerge)) {
        return cb(false);
      }

      this._data = this._data.map((d) => {
        if (Immutable.is(d, oldDataItem)) {
          return oldDataItem.merge(toMerge);
        }
        return d;
      });
    } else {
      this._data = this._data.push(toMerge);
    }
    return cb(true);
  }

  /* mergeAll
   *
   * If the dataToMerge exists in the store (as found by
   * the mergeKey), then merge in new data if there are
   * changes. The merge algorithm differs from the one
   * in .merge() as this will merge the new data into all
   * entities in the store that match on the merge key and
   * not just the first one.
   *
   * If it does not exist in the store, then do nothing.
   *
   * @param {string} mergeKey - use to match objects
   * @param {object} dataToMerge - new object with data
   * @param {fn} cb - defaults to calling this.emitChange()
   *                  when the store's data has changed
   *
  */
  mergeAll(mergeKey, dataToMerge, cb = defaultChangedCallback.bind(this)) {
    let dataHasChanged = false;
    const toMerge = Immutable.fromJS(dataToMerge);
    const matches = this._data.find((d) =>
      d.get(mergeKey) === toMerge.get(mergeKey)
    );

    if (!matches) return cb(false);

    this._data = this._data.map((d) => {
      const shouldMerge = (d.get(mergeKey) === toMerge.get(mergeKey));
      if (!shouldMerge) return d;

      const merged = d.merge(toMerge);
      if (Immutable.is(d, merged)) {
        return d;
      }

      dataHasChanged = true;
      return merged;
    });

    return cb(dataHasChanged);
  }

  mergeMany(mergeKey, arrayOfDataToMerge, cb = defaultChangedCallback.bind(this)) {
    let dataHasChanged = false;
    arrayOfDataToMerge.forEach((newData) => {
      this.merge(mergeKey, newData, (changed) => {
        if (changed) dataHasChanged = true;
      });
    });

    cb(dataHasChanged);
  }
}
