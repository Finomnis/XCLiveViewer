import { EventEmitter } from "events";
import mapEventToState from "../../util/EventToReactState";
import XContestSocket from "./XContestSocket";
import XContestAnimation from "./XContestAnimation";

export const ConnectionState = {
  CONNECTING: "connecting", //orange
  ERROR: "error", //red
  ESTABLISHED: "established", //yellow
  ACTIVE: "active", //green
  INACTIVE: "inactive", //orange
  NO_CONNECTION: "no connection", //red
  NO_INFORMATION: "no information" //gray
};

class XContestInterface {
  constructor() {
    this.pilots = [];
    this.eventEmitter = new EventEmitter();
    this.socket = new XContestSocket(
      this.onConnectionStateChanged,
      this.onInfoMessageReceived,
      this.onTracklogMessageReceived
    );
    this.animation = new XContestAnimation(this.setSubscribedFlights);
  }

  setSubscribedFlights = flights => {
    this.socket.setSubscribedFlights(flights);
  };

  onConnectionStateChanged = state => {
    this.eventEmitter.emit("connectionStateChanged", state);
  };

  onInfoMessageReceived = msg => {
    this.pilots = {};
    for (const [trackId, track] of msg) {
      // Skip if we have a newer track of the same person
      if (track.overriden) continue;

      track.flightId = trackId;

      this.pilots[track.info.user.username] = track;
    }
    this.eventEmitter.emit("pilotStateChanged", this.pilots);
    this.animation.pushNewInfo(this.pilots);
  };

  onTracklogMessageReceived = msg => {
    this.animation.pushNewData(msg.flightUuid, msg.trackChunk);
  };
}

// Singleton stuff
let _instance = null;
export const getXContestInterface = () => {
  if (!_instance) {
    _instance = new XContestInterface();
  }
  return _instance;
};

export const useXContestPilots = mapEventToState(
  () => getXContestInterface().eventEmitter,
  "pilotStateChanged",
  []
);

export const useXContestConnectionState = mapEventToState(
  () => getXContestInterface().eventEmitter,
  "connectionStateChanged",
  ConnectionState.NO_INFORMATION
);
