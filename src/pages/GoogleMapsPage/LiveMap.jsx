import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Box from "@material-ui/core/Box";
import useGoogleMapsApi from "../../common/GoogleMapsApiLoader";
import { LoadingPage, ErrorPage } from "../StatusPages";
import mapStyle from "./MapStyle.json";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import MapAnimator from "./MapAnimator";
import { pure } from "recompose";
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

const LiveMap = () => {
  const [mapReady, mapError, google] = useGoogleMapsApi();
  const mapsRef = useRef();
  const [map, setMap] = useState(null);

  // Initialize Map
  useLayoutEffect(() => {
    if (mapReady && !map) {
      setMap(
        new google.maps.Map(mapsRef.current, {
          center: { lat: 46.509012, lng: 11.827984 },
          mapTypeId: "terrain",
          zoom: 5,
          maxZoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          scaleControl: true,
          fullscreenControl: true,
          styles: mapStyle,
        })
      );
    }
  }, [mapReady, map, google, mapsRef]);

  // Additional maps callbacks to influence maps behaviour
  useEffect(() => {
    if (map && google) {
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

      // Cleanups
      return () => {
        getSetting(Settings.GPS_SHOWN).unregisterCallback(mapButtonUpdater);
      };
    }
  }, [map, google]);

  // Register map for updates
  useEffect(() => {
    if (map && google) {
      const mapAnimator = new MapAnimator(map, google);
      const mapAnimatorUpdateCallback = mapAnimator.update;
      getXContestInterface().animation.registerCallback(
        mapAnimatorUpdateCallback
      );

      const geolocationMarker = createGeolocationMarker(google, null);
      geolocationMarker.setPositionOptions({ enableHighAccuracy: true });

      // enable/disable geolocation marker on change
      const geolocationMarkerUpdateState = (newValue) => {
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

      // Register Map Controller
      let mapController = new GoogleMapsController(google, map);
      getMapViewportControllerService().registerMapController(mapController);

      return () => {
        // Unregister Map Controller
        getMapViewportControllerService().unregisterMapController(
          mapController
        );

        // Shutdown mapController
        mapController.shutdown();

        // Stop animation
        getXContestInterface().animation.unregisterCallback(
          mapAnimatorUpdateCallback
        );

        // Unregister connection between GPS_ENABLED setting and geolocationMarker
        getSetting(Settings.GPS_ENABLED).unregisterCallback(
          geolocationMarkerUpdateState
        );
        getSetting(Settings.GPS_SHOWN).unregisterCallback(
          geolocationMarkerUpdateState
        );

        // Disable geolocationMarker
        geolocationMarker.setMap(null);
      };
    }
  }, [map, google]);

  return (
    <React.Fragment>
      <Box
        width="100%"
        height="100%"
        display={mapReady ? "block" : "none"}
        ref={mapsRef}
        onWheel={() => {
          // Free camera on mouse wheel
          getMapViewportControllerService().setFreeMode();
        }}
      ></Box>
      <LoadingPage
        message="Loading Maps ..."
        hideIf={mapReady || mapError}
      ></LoadingPage>
      <ErrorPage message="Unable to load map!" hideIf={!mapError}></ErrorPage>
    </React.Fragment>
  );
};

export default pure(LiveMap);
