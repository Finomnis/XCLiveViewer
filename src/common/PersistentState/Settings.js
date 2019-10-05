import { registerPersistentState } from "./PersistentState";

// Keys
export const Settings = {
  PATH_LENGTH: "PATH_LENGTH",
  LIMIT_PATHS: "LIMIT_PATHS",
  LOW_LATENCY: "LOW_LATENCY",
  ANIMATION_DELAY: "ANIMATION_DELAY",
  FPS_LIMIT: "FPS_LIMIT",
  FPS_RATE: "FPS_RATE"
};

// Wrapper for simplification
const createSetting = (key, value) =>
  registerPersistentState("SETTINGS_" + key, value);

// Settings objects
const settingsObjects = {
  PATH_LENGTH: createSetting(Settings.PATH_LENGTH, 15),
  LIMIT_PATHS: createSetting(Settings.LIMIT_PATHS, true),
  LOW_LATENCY: createSetting(Settings.LOW_LATENCY, false),
  ANIMATION_DELAY: createSetting(Settings.ANIMATION_DELAY, 80),
  FPS_LIMIT: createSetting(Settings.FPS_LIMIT, true),
  FPS_RATE: createSetting(Settings.FPS_RATE, 10)
};

export const getSetting = key => settingsObjects[key];

export const resetAllSettings = () => {
  Object.values(settingsObjects).forEach(settingsObj =>
    settingsObj.setValue(null)
  );
};
