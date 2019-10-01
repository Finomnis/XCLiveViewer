import {
  getChosenPilots,
  getChosenPilotsObject
} from "../../common/PersistentState/ChosenPilots";
import { useState, useEffect } from "react";
import FlightAnimation from "./FlightAnimation";
import HighPrecisionTimeSync from "../../util/HighPrecisionTimeSync";

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
    const newAnimationData = {};
    Object.keys(this._subscribedPilots).forEach(pilot => {
      if (pilot in this._pilotInfos) {
        const flightId = this._pilotInfos[pilot].flightId;
        if (flightId in this._flightAnimations) {
          const flightAnim = this._flightAnimations[flightId];
          newAnimationData[pilot] = flightAnim.updateAnimation(syncedTime);
        }
      }
    });

    this._updateAnimationData(newAnimationData);
    requestAnimationFrame(this.animationLoop);
  };

  _updateAnimationData = data => {
    this._currentAnimationData = data;
    for (const cb of this._callbacks) {
      cb(data);
    }
  };

  // External
  setSubscribedPilots = subscribedPilots => {
    this._subscribedPilots = subscribedPilots;
    this._updateSubscribedFlights();
  };
  pushNewInfo = pilotInfo => {
    console.log("newInfo: ", pilotInfo);
    this._pilotInfos = pilotInfo;
    this._updateSubscribedFlights();
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
  _updateSubscribedFlights = () => {
    let importantFlights = Object.values(this._pilotInfos)
      .filter(val => val.info.user.username in this._subscribedPilots)
      .map(val => val.flightId);

    let importantFlightSet = new Set(importantFlights);

    if (!eqSet(importantFlightSet, this._subscribedFlights)) {
      console.log("Swap: ", this._subscribedFlights, importantFlightSet);
      this._setSubscribedFlights(importantFlightSet);
    }
  };
}
