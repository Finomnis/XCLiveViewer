import {
  getChosenPilots,
  getChosenPilotsObject
} from "../../common/PersistentState/ChosenPilots";
import { useState, useEffect } from "react";
import FlightAnimation from "./FlightAnimation";
import HighPrecisionTimeSync from "../../util/HighPrecisionTimeSync";
import { Settings, getSetting } from "../../common/PersistentState/Settings";

function eqSet(as, bs) {
  if (as.size !== bs.size) return false;
  for (const a of as) if (!bs.has(a)) return false;
  return true;
}

export default class XContestAnimation {
  constructor(setSubscribedFlights) {
    this._currentAnimationData = {};
    this._callbacks = [];
    this._subscribedPilots = getChosenPilots();
    this._subscribedFlights = new Set();
    this._pilotInfos = {};
    this._flightAnimations = {};
    this._highPrecisionTimeSync = new HighPrecisionTimeSync();
    const settings_timeOffset = getSetting(Settings.ANIMATION_DELAY);
    const settings_lowLatencyMode = getSetting(Settings.LOW_LATENCY);
    this._setting_timeOffset = settings_timeOffset.getValue();
    this._setting_lowLatencyMode = settings_lowLatencyMode.getValue();
    settings_timeOffset.registerCallback(value => {
      this._setting_timeOffset = value;
    });
    settings_lowLatencyMode.registerCallback(value => {
      this._setting_lowLatencyMode = value;
    });

    this._setSubscribedFlights = flights => {
      this._subscribedFlights = flights;
      setSubscribedFlights(Array.from(flights));
    };
    getChosenPilotsObject().registerCallback(this.setSubscribedPilots);
    requestAnimationFrame(this.animationLoop);
  }

  // Animation loop
  animationLoop = highPrecisionTime => {
    const absTime = Date.now();
    const syncedTime = this._highPrecisionTimeSync.get(
      highPrecisionTime,
      absTime
    );

    const offsetTime = syncedTime - 1000 * this._setting_timeOffset;
    const newAnimationData = {};
    Object.keys(this._subscribedPilots).forEach(pilot => {
      if (pilot in this._pilotInfos) {
        const flightId = this._pilotInfos[pilot].flightId;
        if (flightId in this._flightAnimations) {
          const flightAnim = this._flightAnimations[flightId];
          newAnimationData[pilot] = flightAnim.updateAnimation(
            offsetTime,
            this._setting_lowLatencyMode
          );
        }
      }
    });

    this._submitAnimationFrame(newAnimationData);
    requestAnimationFrame(this.animationLoop);
  };

  _submitAnimationFrame = data => {
    this._currentAnimationData = data;
    for (const cb of this._callbacks) {
      cb(data, this._subscribedPilots);
    }
  };

  // External
  setSubscribedPilots = subscribedPilots => {
    this._subscribedPilots = subscribedPilots;
    this._updateImportantFlights();
  };
  pushNewInfo = pilotInfo => {
    console.log("newInfo: ", pilotInfo);
    this._pilotInfos = pilotInfo;
    this._updateImportantFlights();
  };
  pushNewData = (trackId, trackData) => {
    console.log("newTrackdata: ", trackId, trackData);
    if (!(trackId in this._flightAnimations))
      this._flightAnimations[trackId] = new FlightAnimation();
    this._flightAnimations[trackId].updateData(trackData);
  };

  // callback gets called every frame with new data
  registerCallback = cb => {
    if (!this._callbacks.includes(cb)) this._callbacks.push(cb);
  };
  unregisterCallback = cb => {
    const index = this._callbacks.indexOf(cb);
    if (index >= 0) {
      this._callbacks.splice(index, 1);
    }
  };

  useAnimatedData = () => {
    const [value, setValue] = useState(this._currentAnimationData);

    useEffect(() => {
      const cb = newValue => {
        // trigger component update on change
        setValue(newValue);
      };

      this.registerCallback(cb);
      return () => this.unregisterCallback(cb);
    }, []);

    return value;
  };

  // Internal
    let importantFlights = Object.values(this._pilotInfos)
  _updateImportantFlights = () => {
      .filter(val => val.info.user.username in this._subscribedPilots)
      .map(val => val.flightId);

    let importantFlightSet = new Set(importantFlights);

    if (!eqSet(importantFlightSet, this._subscribedFlights)) {
      console.log("Swap: ", this._subscribedFlights, importantFlightSet);
      this._setSubscribedFlights(importantFlightSet);
    }
  };
}
