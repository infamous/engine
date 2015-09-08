'use strict';

class Registry {
  constructor() {
    this._keyToValue = {};
    this._values = [];
    this._keys = [];
    this._keyToIndex = {};
    this._freedIndices = [];
  }

  register(key, value) {
    var index = this._keyToIndex[key];
    if (index == null) {
      index = this._freedIndices.pop();
      if (index === undefined)
        index = this._values.length;

      this._values[index] = value;
      this._keys[index] = key;

      this._keyToIndex[key] = index;
      this._keyToValue[key] = value;
    } else {
      this._keyToValue[key] = value;
      this._values[index] = value;
    }
  };

  unregister(key) {
    var index = this._keyToIndex[key];

    if (index != null) {
      this._freedIndices.push(index);
      this._keyToValue[key] = null;
      this._keyToIndex[key] = null;
      this._values[index] = null;
      this._keys[index] = null;
    }
  };

  get(key) {
    return this._keyToValue[key];
  };

  getValues() {
    return this._values;
  };

  getKeys() {
    return this._keys;
  };

  getKeyToValue() {
    return this._keyToValue;
  };

}

export { Registry };
