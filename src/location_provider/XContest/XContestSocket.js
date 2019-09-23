import { ConnectionState } from "./XContestInterface";

export default class XContestSocket {
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
