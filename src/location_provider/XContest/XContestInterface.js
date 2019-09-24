import { EventEmitter } from "events";
import mapEventToState from "../../util/EventToReactState";
import XContestSocket from "./XContestSocket";

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
    this.pilots = {};
    this.shortTracks = {};
    this.eventEmitter = new EventEmitter();
    this.socket = new XContestSocket(
      this.onConnectionStateChanged,
      this.onInfoMessageReceived
    );
  }

  onConnectionStateChanged = state => {
    this.eventEmitter.emit("connectionStateChanged", state);
  };

  onInfoMessageReceived = msg => {
    console.log(msg);
  };

  onTracklogMessageReceived = state => {};
}

// Singleton stuff
let _instance = null;
const getXContestInterface = () => {
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

// Hook. Fires every time the short tracks list got updated.
export const useXContestShortTracks = mapEventToState(
  () => getXContestInterface().eventEmitter,
  "shortTracksChanged",
  {}
);
