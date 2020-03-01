import { getSetting, Settings } from "../common/PersistentState/Settings";

class GPSProvider {
  constructor() {
    this._callbacks = [];
    this._watchId = null;
    this._gpsData = null;

    let gpsEnabledSetting = getSetting(Settings.GPS_ENABLED);
    gpsEnabledSetting.registerCallback(this._updateGPSState);
    this._updateGPSState();
  }

  _updateGPSState = () => {
    let gpssettingEnabled = getSetting(Settings.GPS_ENABLED).getValue();
    let callbackRegistered = this._callbacks.length > 0;

    let enableGps = gpssettingEnabled && callbackRegistered;

    if (this._watchId === null && enableGps && navigator.geolocation) {
      this._watchId = navigator.geolocation.watchPosition(
        this._onNewGPSData,
        this._onGPSError,
        { enableHighAccuracy: true }
      );
      console.log("GPS: On");
    }

    if (this._watchId !== null && !enableGps) {
      navigator.geolocation.clearWatch(this._watchId);
      this._watchId = null;
      this._setGPSData(null);
      console.log("GPS: Off");
    }

    //console.log("UPDATE_GPS_STATE", enableGps, this._callbacks.length);
  };

  _setGPSData = data => {
    console.log("GPS DATA:", data);
    this._gpsData = data;
    for (const cb of this._callbacks) {
      cb(data);
    }
  };

  _onNewGPSData = data => {
    this._setGPSData(data);
  };
  _onGPSError = () => {
    this._setGPSData(null);
  };

  registerCallback = cb => {
    if (!this._callbacks.includes(cb)) this._callbacks.push(cb);
    this._updateGPSState();
    cb(this._gpsData);
  };

  unregisterCallback = cb => {
    const index = this._callbacks.indexOf(cb);
    if (index >= 0) {
      this._callbacks.splice(index, 1);
    }
    this._updateGPSState();
  };

  getData = () => {
    return this._gpsData;
  };
}

// Singleton stuff
let _instance = null;
export const getGPSProvider = () => {
  if (!_instance) {
    _instance = new GPSProvider();
  }
  return _instance;
};
