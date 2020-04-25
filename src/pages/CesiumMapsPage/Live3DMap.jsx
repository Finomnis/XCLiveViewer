import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Box from "@material-ui/core/Box";
import { pure } from "recompose";

import {
  Viewer,
  UrlTemplateImageryProvider,
  createWorldTerrain,
  //CesiumTerrainProvider,
  Credit,
} from "cesium";

const Live3DMap = () => {
  const viewerRef = useRef();
  const [viewer, setViewer] = useState(null);

  // Initialize Map
  useLayoutEffect(() => {
    if (!viewer) {
      setViewer(
        new Viewer(viewerRef.current, {
          timeline: false,
          scene3DOnly: true,
          animation: false,
          baseLayerPicker: false,
          terrainProvider: createWorldTerrain(),
          /*terrainProvider: new CesiumTerrainProvider({
            url:
              "https://api.maptiler.com/tiles/terrain-quantized-mesh/?key=SXpdfSCBLXk0oRRLfXgH", // get your own key at https://cloud.maptiler.com/
          }),*/
          imageryProvider: new UrlTemplateImageryProvider({
            url:
              "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=SXpdfSCBLXk0oRRLfXgH",
            tileWidth: 256,
            tileHeight: 256,
            credit: new Credit(
              '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
              true
            ),
          }),
        })
      );
    }
  }, [viewer, viewerRef]);

  // Additional maps callbacks to influence maps behaviour
  useEffect(() => {
    if (viewer) {
      // Register map type callback
    }
  }, [viewer]);

  /*
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
      if (getSetting(Settings.GPS_ENABLED).getValue()) {
        geolocationMarker.setMap(map);
      }
      const geolocationMarkerStateUpdater = (enabled) => {
        if (enabled) {
          geolocationMarker.setMap(map);
        } else {
          geolocationMarker.setMap(null);
        }
      };
      getSetting(Settings.GPS_ENABLED).registerCallback(
        geolocationMarkerStateUpdater
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
          geolocationMarkerStateUpdater
        );

        // Disable geolocationMarker
        geolocationMarker.setMap(null);
      };
    }
  }, [map, google]);
  */
  return <Box width="100%" height="100%" ref={viewerRef}></Box>;
};

export default pure(Live3DMap);
