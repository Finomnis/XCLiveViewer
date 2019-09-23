import { useEffect, useState } from "react";
import { EventEmitter } from "events";
import mapEventToState from "../util/EventToReactState";

const ConnectionState = {
  CONNECTING: "connecting", //orange
  ERROR: "error", //red
  ESTABLISHED: "established", //yellow
  ACTIVE: "active", //green
  INACTIVE: "inactive", //orange
  NO_CONNECTION: "no connection", //red
  NO_INFORMATION: "no information" //gray
};

class XContestSocket {
  constructor(onStateChanged, onInfoMessage, onTracklogMessage) {
    this.setConnectionState = onStateChanged;
    this.connect();
  }

  connect() {
    if ("WebSocket" in window) {
      this.setConnectionState(ConnectionState.CONNECTING);
      this.sock = new WebSocket("wss://live.xcontest.org/websock/webclient");
      this.sock.onopen = this.onOpen;
      this.sock.onmessage = this.onMessage;
      this.sock.onclose = this.onClose;
      this.sock.onerror = this.onError;
    } else {
      this.setConnectionState(ConnectionState.ERROR);
      // The browser doesn't support WebSocket
      alert("WebSocket NOT supported by your Browser!");
    }
  }

  onOpen = () => {
    console.log("WS:Open!");
    this.setConnectionState(ConnectionState.ESTABLISHED);

    // Set area filter to the entire world
    this.sock.send(
      JSON.stringify({
        tag: "WebFilterArea",
        area: [{ lat: -90, lon: -180 }, { lat: 90, lon: 180 }]
      })
    );

    // Use current 'fake' contest that is valid for the current alpha phase.
    // Primarily sent to match the messages from their reverse engineered websocket
    this.sock.send(
      JSON.stringify({ tag: "WebFilterContest", contents: "alpha9999" })
    );

    // Tell the webserver which flights we want in more detail. TODO.
    this.sock.send(JSON.stringify({ tag: "WebFollow", contents: [] }));
  };

  onMessage = msg => {
    console.log("WS:Message!");
    this.setConnectionState(ConnectionState.ACTIVE);

    let received_msg = JSON.parse(msg.data);
    console.log("Received: ", received_msg);

    // Expect the next message in 60 seconds. If not, change the status message.
    clearTimeout(this.watchdog);
    this.watchdog = setTimeout(function() {
      this.setConnectionState(ConnectionState.INACTIVE);
    }, 70000);

    // Send to user
    //TODO process_msg(received_msg);
  };

  onClose = msg => {
    console.log("WS:Close!");
    this.setConnectionState(ConnectionState.NO_CONNECTION);
    // websocket is closed.
    setTimeout(this.connect.bind(this), 3000);
    console.log("Connection is closed.", msg);
  };

  onError = msg => {
    console.log("WS:Error!");
  };
}

class XContestInterface {
  constructor() {
    this.pilots = {};
    this.shortTracks = {};
    this.eventEmitter = new EventEmitter();
    this.socket = new XContestSocket(this.onConnectionStateChanged);
  }

  onConnectionStateChanged = state => {
    console.log("New connection state: ", state);
    this.eventEmitter.emit("connectionStateChanged", state);
  };

  onInfoMessageReceived = state => {};

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
