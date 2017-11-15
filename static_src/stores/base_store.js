/*
 * Includes basic functionality that all stores need.
 */

import { EventEmitter } from "events";
import Immutable from "immutable";

import AppDispatcher from "../dispatcher.js";
import LoadingStatus from "../util/loading_status.js";

// TODO clean up the listeners and reduce the MAX_LISTENERS to 15
const MAX_LISTENERS = 20;
const MAX_LISTENERS_THRESHOLD = 10;

function defaultChangedCallback(changed) {
  if (changed) this.emitChange();
}

export default class BaseStore extends EventEmitter {
  constructor() {
    super();
    this.loadingStatus = new LoadingStatus();
    this.loadingStatus.on("loading", () => this.emitChange());
    this.loadingStatus.on("loaded", () => this.emitChange());
    this.storeData = new Immutable.List();
    this.listenerCount = 0;
    this.setMaxListeners(MAX_LISTENERS);
  }

  subscribe(actionSubscribe) {
    this.dispatchToken = AppDispatcher.register(actionSubscribe());
  }

  unsubscribe() {
    AppDispatcher.unregister(this.dispatchToken);
  }

  get loading() {
    return !this.loadingStatus.isLoaded;
  }

  isEmpty() {
    if (this.storeData.count() === 0) return true;
    return false;
  }

  push(val) {
    const newData = Immutable.fromJS(val);
    this.storeData = this.storeData.push(newData);
    this.emitChange();

    return this.storeData;
  }

  get(guid) {
    if (guid && !this.isEmpty()) {
      const item = this.storeData.find(space => space.get("guid") === guid);

      if (item) return item.toJS();
    }
    return undefined;
  }

  getAll() {
    return this.storeData.toJS();
  }

  dataHasChanged(toCompare) {
    const c = Immutable.fromJS(toCompare);
    return !Immutable.is(this.storeData, c);
  }

  deleteProp(guid, prop, cb = defaultChangedCallback.bind(this)) {
    const index = this.storeData.findIndex(d => d.get("guid") === guid);

    if (index === -1) return cb(false);

    this.storeData = this.storeData.deleteIn([index, prop]);
    return cb(true);
  }

  delete(guid, cb = defaultChangedCallback.bind(this)) {
    const index = this.storeData.findIndex(d => d.get("guid") === guid);

    if (index === -1) return cb(false);

    this.storeData = this.storeData.delete(index);
    return cb(true);
  }

  clear(cb = defaultChangedCallback.bind(this)) {
    const old = this.storeData;
    this.storeData = this.storeData.clear();
    return cb(!this.storeData.equals(old));
  }

  formatSplitResponse(resources) {
    return resources.map(r => Object.assign(r.entity, r.metadata));
  }

  emitChange() {
    this.emit("CHANGE");
  }

  addChangeListener(cb) {
    if (++this.listenerCount > MAX_LISTENERS_THRESHOLD) {
      /* eslint-disable no-console */
      console.warn("listener count is above threshold", {
        store: this.constructor.name,
        count: this.listenerCount
      });
      console.trace();
      /* eslint-enable no-console */
    }

    this.on("CHANGE", cb);
  }

  removeChangeListener(cb) {
    this.removeListener("CHANGE", cb);
    this.listenerCount--;
  }

  load(promises) {
    this.loadingStatus.load(promises);
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
    const oldDataItem = this.storeData.find(
      d => d.get(mergeKey) === toMerge.get(mergeKey)
    );

    if (oldDataItem) {
      if (Immutable.is(oldDataItem, toMerge)) {
        return cb(false);
      }

      this.storeData = this.storeData.map(d => {
        if (Immutable.is(d, oldDataItem)) {
          return oldDataItem.merge(toMerge);
        }
        return d;
      });
    } else {
      this.storeData = this.storeData.push(toMerge);
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
    const matches = this.storeData.find(
      d => d.get(mergeKey) === toMerge.get(mergeKey)
    );

    if (!matches) return cb(false);

    this.storeData = this.storeData.map(d => {
      const shouldMerge = d.get(mergeKey) === toMerge.get(mergeKey);
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

  mergeMany(
    mergeKey,
    arrayOfDataToMerge,
    cb = defaultChangedCallback.bind(this)
  ) {
    let dataHasChanged = false;
    arrayOfDataToMerge.forEach(newData => {
      this.merge(mergeKey, newData, changed => {
        if (changed) dataHasChanged = true;
      });
    });

    cb(dataHasChanged);
  }
}
