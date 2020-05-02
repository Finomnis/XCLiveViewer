import { Settings, getSetting } from "../common/PersistentState/Settings";

import NoSleep from "nosleep.js";

export function startNoSleepService() {
  const noSleep = new NoSleep();

  const enableNoSleep = () => {
    console.debug("Enable nosleep!");
    noSleep.enable();
  };

  const disableNoSleep = () => {
    console.debug("Disable nosleep!");
    noSleep.disable();
  };

  // Fetch setting
  const noSleepSetting = getSetting(Settings.PREVENT_SLEEP);

  // Enable wake lock.
  // (must be wrapped in a user input event handler e.g. a mouse or touch handler)
  const initiator = () => {
    document.removeEventListener("mousedown", initiator, false);
    document.removeEventListener("touchstart", initiator, false);
    if (noSleepSetting.getValue()) enableNoSleep();
  };

  document.addEventListener("mousedown", initiator, false);
  document.addEventListener("touchstart", initiator, false);

  noSleepSetting.registerCallback((value) => {
    if (value) {
      enableNoSleep();
    } else {
      disableNoSleep();
    }
  });
}
