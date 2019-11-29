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
          zoom: 12,
          maxZoom: 15,
          disableDefaultUI: true,
          scaleControl: true,
          fullscreenControl: true,
          styles: mapStyle
        })
      );
    }
  }, [mapReady, map, google, mapsRef]);

  // Register map for updates
  useEffect(() => {
    if (map && google) {
      const mapAnimator = new MapAnimator(map, google);
      const mapAnimatorUpdateCallback = mapAnimator.update;
      getXContestInterface().animation.registerCallback(
        mapAnimatorUpdateCallback
      );

      const geolocationMarker = createGeolocationMarker(google, map);
      geolocationMarker.setPositionOptions({ enableHighAccuracy: true });

      return () => {
        getXContestInterface().animation.unregisterCallback(
          mapAnimatorUpdateCallback
        );
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
