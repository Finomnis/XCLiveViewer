import React from "react";
import Box from "@material-ui/core/Box";
import { loadGoogleMapsApi } from "../../common/GoogleMapsApiLoader";
import { LoadingPage, ErrorPage } from "../StatusPages";
import mapStyle from "./MapStyle.json";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import MapAnimator from "./MapAnimator";
import "./gm-style-overrides.css";
import { createGeolocationMarker } from "../../ext/geolocation-marker";
import { getSetting, Settings } from "../../common/PersistentState/Settings";
import { getMapViewportControllerService } from "../../services/MapViewportControllerService";
import GoogleMapsController from "./GoogleMapsController";

import "./CustomButtons/CustomButtons.css";
import { createSatelliteMapButton } from "./CustomButtons/SatelliteMapButton";
import { createFocusCameraMapButton } from "./CustomButtons/FocusCameraMapButton";
import {
  createDisplayGpsMapButton,
  updateGpsMapButton,
} from "./CustomButtons/DisplayGpsMapButton";
import { getGPSProvider } from "../../services/GPSProvider";
import ContextMenuHandler from "../../util/ContextMenuHandler";
import ContextMenu from "../common/ContextMenu";
import { getChosenPilots } from "../../common/PersistentState/ChosenPilots";

export default class LiveMap extends React.PureComponent {
  constructor() {
    super();

    this.map = null;
    this.google = null;
    this.mapAnimator = null;

    this.mapsRef = React.createRef();
    this.cleanups = [];

    this.state = {
      mapReady: false,
      mapError: false,
      contextMenu: null,
    };

    this.contextMenuHandler = new ContextMenuHandler(this.onContextMenu);

    this.initializeGoogleMapsApi();
  }

  initializeGoogleMapsApi = () => {
    const mapsApiLoadingState = { canceled: false };

    this.cleanups.push(() => {
      mapsApiLoadingState.canceled = true;
    });

    loadGoogleMapsApi()
      .then(() => {
        if (mapsApiLoadingState.canceled) return;
        this.google = window.google;
        this.setState({ mapReady: true });
      })
      .catch((e) => {
        if (mapsApiLoadingState.canceled) return;
        console.log("Map error:", e);
        this.setState({ mapError: true });
      });
  };

  initializeMapIfNecessary = () => {
    if (!this.state.mapReady || this.state.mapError) return;

    if (this.map !== null) return;

    this.map = new this.google.maps.Map(this.mapsRef.current, {
      center: { lat: 46.509012, lng: 11.827984 },
      mapTypeId: "terrain",
      zoom: 5,
      maxZoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
      scaleControl: true,
      fullscreenControl: true,
      styles: mapStyle,
    });

    const map = this.map;
    const google = this.google;

    // Register map type callback
    map.addListener("maptypeid_changed", () => {
      if (map.getMapTypeId() === google.maps.MapTypeId.TERRAIN) {
        map.setOptions({ maxZoom: 15 });
      } else {
        map.setOptions({ maxZoom: 50 });
      }
    });

    // Add custom map controls
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      createSatelliteMapButton(google, map)
    );
    const gpsMapButton = createDisplayGpsMapButton(google, map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(gpsMapButton);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
      createFocusCameraMapButton(google, map)
    );

    // Update gps button on change
    let mapButtonUpdater = (value) => {
      updateGpsMapButton(gpsMapButton, value);
    };
    getSetting(Settings.GPS_SHOWN).registerCallback(mapButtonUpdater);
    this.cleanups.push(() => {
      getSetting(Settings.GPS_SHOWN).unregisterCallback(mapButtonUpdater);
    });

    // Map animator
    this.mapAnimator = new MapAnimator(
      map,
      google,
      () => this.state.contextMenu === null
    );
    const mapAnimatorUpdateCallback = this.mapAnimator.update;
    getXContestInterface().animation.registerCallback(
      mapAnimatorUpdateCallback
    );
    this.cleanups.push(() => {
      getXContestInterface().animation.unregisterCallback(
        mapAnimatorUpdateCallback
      );
    });

    const geolocationMarker = createGeolocationMarker(google, null);
    geolocationMarker.setPositionOptions({ enableHighAccuracy: true });

    // enable/disable geolocation marker on change
    const geolocationMarkerUpdateState = () => {
      let enabled = getSetting(Settings.GPS_ENABLED).getValue();
      let shown = getSetting(Settings.GPS_SHOWN).getValue();
      if (enabled && shown) {
        geolocationMarker.setMap(map);
        // Manually update the position to trigger a redrawing.
        // Kinda hacky, workaround to bug in geolocationMarker
        const currentGPSData = getGPSProvider().getData();
        if (currentGPSData !== null)
          geolocationMarker.updatePosition_(currentGPSData);
      } else {
        geolocationMarker.setMap(null);
      }
    };
    geolocationMarkerUpdateState();
    getSetting(Settings.GPS_ENABLED).registerCallback(
      geolocationMarkerUpdateState
    );
    getSetting(Settings.GPS_SHOWN).registerCallback(
      geolocationMarkerUpdateState
    );
    this.cleanups.push(() => {
      // Unregister connection between GPS_ENABLED setting and geolocationMarker
      getSetting(Settings.GPS_ENABLED).unregisterCallback(
        geolocationMarkerUpdateState
      );
      getSetting(Settings.GPS_SHOWN).unregisterCallback(
        geolocationMarkerUpdateState
      );

      // Disable geolocationMarker
      geolocationMarker.setMap(null);
    });

    // Register Map Controller
    let mapController = new GoogleMapsController(google, map);
    getMapViewportControllerService().registerMapController(mapController);
    this.cleanups.push(() => {
      // Unregister Map Controller
      getMapViewportControllerService().unregisterMapController(mapController);

      // Shutdown mapController
      mapController.shutdown();
    });

    this.mapInitialized = true;
  };

  componentDidMount() {
    this.initializeMapIfNecessary();
  }

  componentDidUpdate() {
    this.initializeMapIfNecessary();
  }

  componentWillUnmount() {
    [...this.cleanups].reverse().forEach((cleanup) => cleanup());
  }

  onContextMenu = (e) => {
    if (this.mapAnimator == null) return;

    // Get mouse position
    const mousePos = {
      left: e.pageX,
      top: e.pageY,
    };

    // Get pilot, if any selected
    const mouseOvers = Object.keys(this.mapAnimator.currentMouseOvers);
    if (mouseOvers.length < 1) return;
    const pilotId = mouseOvers[0];

    // Get pilot props
    const { pilotData } = getXContestInterface().animation.getData();
    if (!(pilotId in pilotData)) return;
    const pilotProps = pilotData[pilotId];

    // Get whether or not the pilot is currently shown
    const chosenPilots = getChosenPilots();
    if (!(pilotId in chosenPilots)) return;
    const shown = chosenPilots[pilotId].shown;
    console.log(shown);

    this.setState({
      contextMenu: {
        pilotId,
        pos: mousePos,
        props: pilotProps,
        shown,
      },
    });
  };

  hideContextMenu = () => {
    this.setState({ contextMenu: null });
  };

  render() {
    return (
      <React.Fragment>
        <Box // Shown if ready,!error
          width="100%"
          height="100%"
          display={
            this.state.mapReady && !this.state.mapError ? "block" : "none"
          }
          ref={this.mapsRef}
          onWheel={() => {
            // Free camera on mouse wheel
            getMapViewportControllerService().setFreeMode();
          }}
          onTouchStart={this.contextMenuHandler.onTouchStart}
          onTouchMove={this.contextMenuHandler.onTouchMove}
          onTouchCancel={this.contextMenuHandler.onTouchCancel}
          onTouchEnd={this.contextMenuHandler.onTouchEnd}
          onContextMenu={this.contextMenuHandler.onContextMenu}
        ></Box>
        <LoadingPage // Shown if !ready,!error
          message="Loading Maps ..."
          hideIf={this.state.mapReady || this.state.mapError}
        ></LoadingPage>
        <ErrorPage // Shown if !ready,error and ready,error
          message="Unable to load map!"
          hideIf={!this.state.mapError}
        ></ErrorPage>
        <ContextMenu
          onMap
          data={this.state.contextMenu}
          onClose={this.hideContextMenu}
        />
      </React.Fragment>
    );
  }
}
