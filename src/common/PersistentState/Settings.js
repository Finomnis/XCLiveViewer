import { registerPersistentState } from "./PersistentState";

// Keys
export const Settings = {
  PATH_LENGTH: "PATH_LENGTH",
  FULL_PATHS: "FULL_PATHS",
  LOW_LATENCY: "LOW_LATENCY",
  ANIMATION_DELAY: "ANIMATION_DELAY"
};

// Wrapper for simplification
const createSetting = (key, value) =>
  registerPersistentState("SETTINGS_" + key, value);

// Settings objects
const settingsObjects = {
  PATH_LENGTH: createSetting(Settings.PATH_LENGTH, 15 * 60),
  FULL_PATHS: createSetting(Settings.FULL_PATHS, false),
  LOW_LATENCY: createSetting(Settings.LOW_LATENCY, false),
  ANIMATION_DELAY: createSetting(Settings.ANIMATION_DELAY, 80)
};

export const getSetting = key => settingsObjects[key];