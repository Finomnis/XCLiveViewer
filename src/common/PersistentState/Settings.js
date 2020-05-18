import { registerPersistentState } from "./PersistentState";
import { PageLayout } from "./PageLayout";

// Keys
export const Settings = {
  PATH_LENGTH: "PATH_LENGTH",
  LIMIT_PATHS: "LIMIT_PATHS",
  LOW_LATENCY: "LOW_LATENCY",
  ANIMATION_DELAY: "ANIMATION_DELAY",
  FPS_LIMIT: "FPS_LIMIT",
  FPS_RATE: "FPS_RATE",
  GPS_ENABLED: "GPS_ENABLED",
  GPS_SHOWN: "GPS_SHOWN",
  PREVENT_SLEEP: "PREVENT_SLEEP",
  SHOW_OFFLINE_PILOTS: "SHOW_OFFLINE_PILOTS",
  PAGE_LAYOUT: "PAGE_LAYOUT",
};

// Wrapper for simplification
const createSetting = (key, value) =>
  registerPersistentState("SETTINGS_" + key, value);

// Settings objects
const settingsObjects = {
  PATH_LENGTH: createSetting(Settings.PATH_LENGTH, 15),
  LIMIT_PATHS: createSetting(Settings.LIMIT_PATHS, false),
  LOW_LATENCY: createSetting(Settings.LOW_LATENCY, false),
  ANIMATION_DELAY: createSetting(Settings.ANIMATION_DELAY, 80),
  FPS_LIMIT: createSetting(Settings.FPS_LIMIT, true),
  FPS_RATE: createSetting(Settings.FPS_RATE, 10),
  GPS_ENABLED: createSetting(Settings.GPS_ENABLED, true),
  GPS_SHOWN: createSetting(Settings.GPS_SHOWN, true),
  PREVENT_SLEEP: createSetting(Settings.PREVENT_SLEEP, false),
  SHOW_OFFLINE_PILOTS: createSetting(Settings.SHOW_OFFLINE_PILOTS, false),
  PAGE_LAYOUT: createSetting(Settings.PAGE_LAYOUT, PageLayout.AUTO),
};

export const getSetting = (key) => settingsObjects[key];

export const resetAllSettings = () => {
  Object.values(settingsObjects).forEach((settingsObj) =>
    settingsObj.setValue(null)
  );
};
