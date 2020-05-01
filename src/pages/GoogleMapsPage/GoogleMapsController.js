import { getMapViewportControllerService } from "../../services/MapViewportControllerService";
import { getGPSProvider } from "../../services/GPSProvider";

export default class GoogleMapsController {
  constructor(google, map) {
    this.google = google;
    this.map = map;
    this.lastUpdate = Date.now();

    this.gpsState = getGPSProvider().getData();
    getGPSProvider().registerCallback(this.onGpsUpdate);

    this.viewportInitialized = false;
    this.singlePersonMode = false;

    this.userInputListeners = [map.addListener("dragstart", this.onUserInput)];

    this.insideMapsApiFunction = false;
  }

  zoomToSinglePilot = () => {
    this.insideMapsApiFunction = true;
    if (this.map.getZoom() < 12) this.map.setZoom(12);
    this.insideMapsApiFunction = false;
  };

  shutdown = () => {
    // Do nothing -- seems broken atm
    //  for (let userInputListener in this.userInputListeners) {
    //    userInputListener.remove();
    //}
    getGPSProvider().unregisterCallback(this.onGpsUpdate);
  };

  onGpsUpdate = (gpsData) => {
    this.gpsState = gpsData;
  };

  onUserInput = () => {
    if (!this.insideMapsApiFunction)
      getMapViewportControllerService().setFreeMode();
  };

  updateViewport = (watchedCoords) => {
    const previousSinglePersonMode = this.singlePersonMode;
    this.singlePersonMode = false;

    if (watchedCoords.length === 0) {
      return;
    }

    if (watchedCoords.length === 1) {
      this.insideMapsApiFunction = true;
      this.map.panTo(watchedCoords[0]);
      this.insideMapsApiFunction = false;

      if (!previousSinglePersonMode) {
        this.zoomToSinglePilot();
      }
      this.singlePersonMode = true;
      return;
    }

    let bounds = new this.google.maps.LatLngBounds(
      watchedCoords[0],
      watchedCoords[0]
    );

    watchedCoords.forEach((coord) => bounds.extend(coord));

    this.insideMapsApiFunction = true;
    this.map.fitBounds(bounds);
    this.insideMapsApiFunction = false;
  };

  onAnimationFrame = (pilotInfos, controllerState) => {
    // Set initial map position after map creations
    if (!this.viewportInitialized) {
      let watchedCoords = [];

      for (const [, pilotInfo] of Object.entries(pilotInfos)) {
        watchedCoords.push(pilotInfo.pos);
      }

      if (this.gpsState) {
        watchedCoords.push({
          lat: this.gpsState.coords.latitude,
          lng: this.gpsState.coords.longitude,
        });
      }

      if (watchedCoords.length !== 0) {
        this.updateViewport(watchedCoords);
        this.viewportInitialized = true;
      }
    }

    // Don't do anything if the controller is disabled
    if (!controllerState.enabled) {
      // Run a viewport update anyway, to register that we currently
      // don't view anyone. Important for registering when we have to
      // zoom in.
      this.updateViewport([]);
      return;
    }

    // If followSinglePilot is set,
    if (controllerState.followSinglePilot !== null) {
      const pilotName = controllerState.followSinglePilot;
      if (pilotName in pilotInfos) {
        this.updateViewport([pilotInfos[pilotName].pos]);
        return;
      }
    }

    let watchedCoords = [];
    if (controllerState.includeSelf) {
      if (this.gpsState) {
        watchedCoords.push({
          lat: this.gpsState.coords.latitude,
          lng: this.gpsState.coords.longitude,
        });
      }
    }
    for (const [pilotName, enabled] of Object.entries(controllerState.pilots)) {
      if (enabled && pilotName in pilotInfos) {
        watchedCoords.push(pilotInfos[pilotName].pos);
      }
    }
    this.updateViewport(watchedCoords);
  };
}
