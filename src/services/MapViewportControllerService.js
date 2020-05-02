import { getXContestInterface } from "../location_provider/XContest/XContestInterface";
import { registerPersistentState } from "../common/PersistentState/PersistentState";
import { getSetting, Settings } from "../common/PersistentState/Settings";

class MapViewportControllerService {
  constructor() {
    this.mapControllers = [];

    // The state of the viewport controller service
    this.state = {
      includeSelf: getSetting(Settings.GPS_SHOWN).getValue(),
      enabled: true,
      followSinglePilot: null,
      pilots: {},
    };

    // Register for animation frame updates
    getXContestInterface().animation.registerCallback(this.onAnimationFrame);

    // Register for changes in GPS_SHOWN setting
    getSetting(Settings.GPS_SHOWN).registerCallback(this.onSelfShownChanged);
  }

  setState = (val) => {
    this.state = { ...this.state, ...val };
  };

  // Disables the controllers, enables manual mode
  setFreeMode = () => {
    this.setState({ enabled: false });
  };

  // Follows a single pilot
  setSinglePilotMode = (pilotId) => {
    this.setState({
      enabled: true,
      followSinglePilot: pilotId,
    });
    this._emitZoomToSinglePilot();
  };

  setFollowMode = () => {
    this.setState({
      enabled: true,
      followSinglePilot: null,
    });
  };

  // Sends single pilot mode signal to controllers
  _emitZoomToSinglePilot = () => {
    for (const mapController of this.mapControllers) {
      mapController.zoomToSinglePilot();
    }
  };

  // When GPS_SHOWN setting changed
  onSelfShownChanged = (value) => {
    this.setState({
      includeSelf: value,
    });
  };

  // Update this and every registered map controller.
  onAnimationFrame = ({ pilotData_filtered }) => {
    // Add new pilots, remove old pilots
    const oldState = this.state;
    const newState = { ...oldState };
    newState.pilots = { ...newState.pilots };

    // Remove old pilots
    for (const pilotName in oldState.pilots) {
      if (!(pilotName in pilotData_filtered)) {
        delete newState.pilots[pilotName];
      }
    }

    // Add new pilots
    for (const pilotName in pilotData_filtered) {
      if (!(pilotName in newState.pilots)) {
        newState.pilots[pilotName] = true;
      }
    }

    this.state = newState;

    for (const mapController of this.mapControllers) {
      mapController.onAnimationFrame(pilotData_filtered, this.state);
    }
  };

  // All other map controllers register here.
  registerMapController = (controller) => {
    if (!this.mapControllers.includes(controller))
      this.mapControllers.push(controller);
  };

  // All other map controllers unregister here.
  unregisterMapController = (controller) => {
    const index = this.mapControllers.indexOf(controller);
    if (index >= 0) {
      this.mapControllers.splice(index, 1);
    }
  };
}

// Singleton
let _instance = null;
export const getMapViewportControllerService = () => {
  if (!_instance) {
    _instance = new MapViewportControllerService();
  }
  return _instance;
};
