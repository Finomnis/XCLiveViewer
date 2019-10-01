import { ConnectionState } from "./XContestInterface";
import { getSetting, Settings } from "../../common/PersistentState/Settings";

export default class XContestSocket {
  constructor(onStateChanged, onInfoMessage, onTracklogMessage) {
    this.setConnectionState = onStateChanged;
    this.dispatchInfoMessage = onInfoMessage;
    this.dispatchTracklogMessage = onTracklogMessage;
    this.subscribedFlights = [];
    this.connect();
    this.connected = false;

    // Register hooks, so we get notified when these settings change
    getSetting(Settings.PATH_LENGTH).registerCallback(
      this.refreshSubscribedFlights
    );
    getSetting(Settings.FULL_PATHS).registerCallback(
      this.refreshSubscribedFlights
    );
  }

  connect() {
    if ("WebSocket" in window) {
      this.connected = false;
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

  formatSubscribedFlights = () => {
    const setting_pathLength = getSetting(Settings.PATH_LENGTH).getValue();
    const setting_fullPath = getSetting(Settings.FULL_PATHS).getValue();

    let startIsoDate = null;
    if (!setting_fullPath) {
      const startDate = new Date(Date.now() - 1000 * setting_pathLength);
      startDate.setMilliseconds(0);
      startIsoDate = startDate.toISOString();
    }

    const formattedFlights = this.subscribedFlights.map(flight => {
      return { flightUuid: flight, start: startIsoDate };
    });

    return formattedFlights;
  };

  refreshSubscribedFlights = () => {
    if (this.sock.readyState === WebSocket.OPEN && this.connected) {
      this.sock.send(
        JSON.stringify({
          tag: "WebFollow",
          contents: this.formatSubscribedFlights()
        })
      );
    }
  };

  setSubscribedFlights = flights => {
    this.subscribedFlights = flights;
    this.refreshSubscribedFlights();
  };

  onOpen = () => {
    this.handleReset();
    console.log("WebSocket: Open!");
    this.setConnectionState(ConnectionState.ESTABLISHED);
    this.connected = true;

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
    this.sock.send(
      JSON.stringify({
        tag: "WebFollow",
        contents: this.formatSubscribedFlights()
      })
    );
  };

  onMessage = evt => {
    console.log("WebSocket: Message!");
    this.setConnectionState(ConnectionState.ACTIVE);

    let msg = JSON.parse(evt.data);

    // Expect the next message in 60 seconds. If not, change the status message.
    clearTimeout(this.watchdog);
    this.watchdog = setTimeout(() => {
      this.setConnectionState(ConnectionState.INACTIVE);
    }, 70000);

    // Process the message
    this.processMessage(msg);
  };

  onClose = evt => {
    this.connected = false;
    console.log("WebSocket: Close!");
    this.setConnectionState(ConnectionState.NO_CONNECTION);
    // websocket is closed.
    setTimeout(this.connect.bind(this), 1000);
  };

  onError = evt => {
    this.connected = false;
    console.log("WebSocket: Error!");
  };

  // Message Processing
  handleReset = () => {
    console.log("TODO: handle reset!");
  };
  processMessage = msg => {
    if (!("tag" in msg)) {
      console.log("Warning: Invalid message format!", msg);
      return;
    }
    switch (msg.tag) {
      case "LiveFlightInfos":
        this.dispatchInfoMessage(msg.contents);
        break;
      case "LiveFlightChunk":
        this.dispatchTracklogMessage(msg);
        break;
      default:
        console.log(`Warning: Unknown message tag '${msg.tag}'!`, msg);
    }
  };
}
