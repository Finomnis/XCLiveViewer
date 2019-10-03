import { useState, useEffect } from "react";

class EventfulState {
  constructor(initialValue) {
    this._callbacks = [];
    this._callbackData = initialValue;
  }

  set = value => {
    this._callbackData = value;
    for (const cb of this._callbacks) {
      cb(value);
    }
  };

  getValue = () => this._callbackData;

  registerCallback = cb => {
    if (!this._callbacks.includes(cb)) this._callbacks.push(cb);
  };

  unregisterCallback = cb => {
    const index = this._callbacks.indexOf(cb);
    if (index >= 0) {
      this._callbacks.splice(index, 1);
    }
  };

  use = () => {
    const [value, setValue] = useState(this._callbackData);

    useEffect(() => {
      // trigger component update on change
      this.registerCallback(setValue);
      return () => this.unregisterCallback(setValue);
    }, []);

    return value;
  };
}

export default EventfulState;
