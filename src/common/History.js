const ourHistory = [];

window.addEventListener(
  "popstate",
  () => {
    if (ourHistory.length === 0) {
      console.warn("History was already 0!");
    }
    const callback = ourHistory.pop();
    //console.debug("- History size:", ourHistory.length);
    if (ourHistory.length > 0) window.history.pushState({}, "");
    if (callback) callback();
  },
  { passive: true }
);

export const useHistory = () => {
  const pushFunction = (cb) => {
    const histSize = ourHistory.length;
    ourHistory.push(cb);
    //console.debug("+ History size:", ourHistory.length);
    if (histSize === 0) {
      window.history.pushState({}, "");
    }
  };

  const popFunction = () => {
    //console.log("window.history.back()", window.history.length);
    window.history.back();
  };

  return { push: pushFunction, pop: popFunction };
};
