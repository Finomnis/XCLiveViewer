import { getXContestInterface } from "../location_provider/XContest/XContestInterface";
import { registerPersistentState } from "../common/PersistentState/PersistentState";

class MapViewportControllerService {
  constructor() {
    this.mapControllers = [];

    // The state of the viewport controller service
    this.state = registerPersistentState("viewport-state", {
      includeSelf: true,
      enabled: true,
      followSinglePilot: null,
      pilots: {}
    });

    // Reset state at every new page load.
    // If this turns out to be intended behaviour, convert the persistent state to
    // a local class state.
    this.state.setValue(null);

    // Register for animation frame updates
    getXContestInterface().animation.registerCallback(this.onAnimationFrame);
  }

  // Disables the controllers, enables manual mode
  setFreeMode = () => {
    this.state.updateValue(oldValue => ({
      ...oldValue,
      enabled: false
    }));
  };

  // Follows a single pilot
  setSinglePilotMode = pilotId => {
    this.state.updateValue(oldValue => ({
      ...oldValue,
      enabled: true,
      followSinglePilot: pilotId
    }));
    this._emitZoomToSinglePilot();
  };

  // Sends single pilot mode signal to controllers
  _emitZoomToSinglePilot = () => {
    for (const mapController of this.mapControllers) {
      mapController.zoomToSinglePilot();
    }
  };

  // Update this and every registered map controller.
  onAnimationFrame = pilotInfos => {
    // Add new pilots, remove old pilots
    this.state.updateValue(oldState => {
      const newState = { ...oldState };
      newState.pilots = { ...newState.pilots };

      // Remove old pilots
      for (const pilotName in oldState.pilots) {
        if (!(pilotName in pilotInfos)) {
          delete newState.pilots[pilotName];
        }
      }

      // Add new pilots
      for (const pilotName in pilotInfos) {
        if (!(pilotName in newState.pilots)) {
          newState.pilots[pilotName] = true;
        }
      }

      return newState;
    });

    for (const mapController of this.mapControllers) {
      mapController.onAnimationFrame(pilotInfos, this.state.getValue());
    }
  };

  // All other map controllers register here.
  registerMapController = controller => {
    if (!this.mapControllers.includes(controller))
      this.mapControllers.push(controller);
  };

  // All other map controllers unregister here.
  unregisterMapController = controller => {
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
