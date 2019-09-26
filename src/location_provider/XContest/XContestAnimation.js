import { getChosenPilots } from "../../common/PersistentState";

function eqSet(as, bs) {
  if (as.size !== bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}

export default class XContestAnimation {
  constructor(setSubscribedFlights) {
    this._callbacks = [];
    this._subscribedPilots = getChosenPilots();
    this._subscribedFlights = new Set();
    this._pilotInfos = {};
    this._setSubscribedFlights = flights => {
      this._subscribedFlights = flights;
      setSubscribedFlights(Array.from(flights));
    };
  }

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
  };

  // callback gets called every frame with new data
  registerCallback(cb) {}
  unregisterCallback(cb) {}

  // Internal
  _updateSubscribedFlights = () => {
    let importantFlights = Object.values(this._pilotInfos)
      .filter(val => val.info.user.username in this._subscribedPilots)
      .map(val => val.flightId);

    let importantFlightSet = new Set(importantFlights);

    if (!eqSet(importantFlightSet, this._subscribedFlights)) {
      console.log("Swap: ", importantFlightSet, this._subscribedFlights);
      this._setSubscribedFlights(importantFlightSet);
    }
  };
}
