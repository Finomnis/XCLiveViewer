import XContestSocket from "./XContestSocket";
import XContestAnimation from "./XContestAnimation";
import EventfulState from "../../util/EventfulState";
import { setChosenPilotsAndUpdateNames } from "../../common/PersistentState/ChosenPilots";

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
    this.connectionState = new EventfulState(ConnectionState.NO_INFORMATION);
    this.pilotInfos = new EventfulState([]);
    this.socket = new XContestSocket(
      this.onConnectionStateChanged,
      this.onInfoMessageReceived,
      this.onTracklogMessageReceived,
      this.onFlightLandedMessageReceived
    );
    this.animation = new XContestAnimation(this.setSubscribedFlights);
  }

  setSubscribedFlights = flights => {
    this.socket.setSubscribedFlights(flights);
  };

  getPilotInfos = () => this.pilots;

  onConnectionStateChanged = state => {
    this.connectionState.set(state);
  };

  onInfoMessageReceived = msg => {
    this.pilots = {};
    for (const [trackId, track] of msg) {
      // Skip if we have a newer track of the same person
      if (track.overriden) continue;

      track.flightId = trackId;

      this.pilots[track.info.user.username] = track;
    }
    this.animation.pushNewInfo(this.pilots);
    this.pilotInfos.set(this.pilots);

    // Set pilot names if available
    setChosenPilotsAndUpdateNames();
  };

  onTracklogMessageReceived = msg => {
    this.animation.pushNewData(msg.flightUuid, msg.trackChunk);
  };

  onFlightLandedMessageReceived = flightId => {
    this.animation.pushFlightLanded(flightId);
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

export const useXContestPilots = () => getXContestInterface().pilotInfos.use();
export const useXContestConnectionState = () =>
  getXContestInterface().connectionState.use();
