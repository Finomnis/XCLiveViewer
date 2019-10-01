import { useState, useEffect } from "react";

class PersistentState {
  constructor(key, initialValue) {
    this.key = key;
    this.initialValue = initialValue;
    this.callbacks = [];
  }

  getValue = () => {
    const value = JSON.parse(localStorage.getItem(this.key));
    if (value === null) return this.initialValue;
    return value;
  };

  _notifyAll = () => {
    const value = this.getValue();
    for (const cb of this.callbacks) {
      cb(value);
    }
  };

  registerCallback = cb => {
    if (!this.callbacks.includes(cb)) this.callbacks.push(cb);
  };

  unregisterCallback = cb => {
    const index = this.callbacks.indexOf(cb);
    if (index >= 0) {
      this.callbacks.splice(index, 1);
    }
  };

  setValue = value => {
    if (value == null) {
      localStorage.removeItem(this.key);
    } else {
      localStorage.setItem(this.key, JSON.stringify(value));
    }

    this._notifyAll();
  };

  use = () => {
    const [value, setValue] = useState(this.getValue);

    useEffect(() => {
      const cb = newValue => {
        // trigger component update on change
        setValue(newValue);
      };

      this.registerCallback(cb);
      return () => this.unregisterCallback(cb);
    }, []);

    return [value, this.setValue];
  };
}

export const registerPersistentState = (name, initialValue) => {
  return new PersistentState(name, initialValue);
};
