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
    const settings_limitFps = getSetting(Settings.FPS_LIMIT);
    const settings_fps = getSetting(Settings.FPS_RATE);

    // Cached settings values for performance improvements. Not sure if actually worth
    this._setting_limitFps = settings_limitFps.getValue();
    this._setting_fps = settings_fps.getValue();
    settings_limitFps.registerCallback(value => {
      this._setting_limitFps = value;
    });
    settings_fps.registerCallback(value => {
      this._setting_fps = value;
    });

    this._setSubscribedFlightsCallback = flights => {
      this._subscribedFlights = flights;
      setSubscribedFlights(Array.from(flights));
    };
    getChosenPilotsObject().registerCallback(this.setSubscribedPilots);
    requestAnimationFrame(this.animationLoop);
  }

  // Animation loop
  _nextUpdate = Date.now();
  animationLoop = () => {
    // Can't use time of function parameter, because we need absolute time
    const absTime = Date.now();

    const frameTimeDelta = 1000.0 / this._setting_fps;

    if (!this._setting_limitFps || absTime >= this._nextUpdate) {
      this._nextUpdate = this._nextUpdate + frameTimeDelta;
      if (this._nextUpdate < absTime) {
        this._nextUpdate = absTime;
      }

      const newAnimationData = {};
      Object.keys(this._subscribedPilots).forEach(pilot => {
        if (pilot in this._pilotInfos) {
          const flightId = this._pilotInfos[pilot].flightId;
          if (flightId in this._flightAnimations) {
            const flightAnim = this._flightAnimations[flightId];
            newAnimationData[pilot] = flightAnim.updateAnimation(absTime);
          }
        }
      });
      this._submitAnimationFrame(newAnimationData);
    }
    requestAnimationFrame(this.animationLoop);
  };

  _submitAnimationFrame = data => {
    this._currentAnimationData = data;
    for (const cb of this._callbacks) {
      cb(data);
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

    // Update flight info in flightAnimations
    Object.values(pilotInfo).forEach(flightInfo => {
      const flightId = flightInfo.flightId;
      if (flightId in this._flightAnimations) {
        this._flightAnimations[flightId].updateInfos(flightInfo);
      }
    });
  };

  pushNewData = (trackId, trackData) => {
    console.log("newTrackdata: ", trackId, trackData);
    if (trackId in this._flightAnimations)
      this._flightAnimations[trackId].updateData(trackData);
  };

  pushFlightLanded = flightId => {
    if (flightId in this._flightAnimations)
      this._flightAnimations[flightId].updateLanded();
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
  _updateImportantFlights = () => {
    // Filter important flights
    let importantFlights = {};
    Object.values(this._pilotInfos)
      .filter(val => val.info.user.username in this._subscribedPilots)
      .forEach(val => {
        importantFlights[val.flightId] = val;
      });

    let importantFlightSet = new Set(Object.keys(importantFlights));

    // Cleanup old entries of _flightAnimations
    {
      const toRemove = [];
      for (const flightId in this._flightAnimations) {
        if (!(flightId in importantFlights)) {
          toRemove.push(flightId);
        }
      }
      for (const flightId of toRemove) {
        console.log("Removing flightAnimation of '" + flightId + "' ...");
        this._flightAnimations[flightId].destroy();
        delete this._flightAnimations[flightId];
      }
    }

    // Add new flightAnimations
    Object.entries(importantFlights).forEach(([flightId, flightInfo]) => {
      if (!(flightId in this._flightAnimations)) {
        this._flightAnimations[flightId] = new FlightAnimation(flightInfo);
      }
    });

    // Send subscription change to socket
    if (!eqSet(importantFlightSet, this._subscribedFlights)) {
      console.log(
        "Changing flight subscribtion: ",
        this._subscribedFlights,
        importantFlightSet
      );
      this._setSubscribedFlightsCallback(importantFlightSet);
    }
  };
}
