import { useEffect, useState } from "react";

class XContestInterface extends EventTarget {
  constructor() {
    super();
    this.pilots = {};
    this.shortTracks = {};
  }

  getPilots() {
    return this.pilots;
  }
  getShortTracks() {
    return this.getShortTracks;
  }
}

// Singleton stuff
let _instance = null;
const getXContestInterface = () => {
  if (!_instance) {
    _instance = new XContestInterface();
  }
  return _instance;
};

// Hook. Fires every time the pilots list got updated.
export const useXContestPilots = () => {
  const [pilotsList, setPilotsList] = useState([]);

  useEffect(() => {
    const xContestInterface = getXContestInterface();

    const onPilotStateChanged = () => {
      "Pilot State Changed!";
    };

    // Register current component at the event source
    xContestInterface.addEventListener(
      "pilotStateChanged",
      onPilotStateChanged
    );

    // Unregister current component from the events at cleanup time
    return () => {
      xContestInterface.removeEventListener(
        "pilotStateChanged",
        onPilotStateChanged
      );
    };
  }, []);

  return pilotsList;
};

// Hook. Fires every time the short tracks list got updated.
export const useXContestShortTracks = () => {};
