import React from "react";
import { useState } from "react";

// Delays the loading of the children until 'initIf' gets set to true for the first time
const LazyLoading = ({ initIf, children }) => {
  const [visible, setVisible] = useState(false);
  if (!visible && initIf) {
    setVisible(true);
  }
  return visible ? <React.Fragment> {children} </React.Fragment> : null;
};

export default LazyLoading;
