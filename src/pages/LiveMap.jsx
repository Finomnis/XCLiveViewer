import React, { useState, useRef, useLayoutEffect } from "react";
import Box from "@material-ui/core/Box";
import useGoogleMapsApi from "../ext/GoogleMapsApiLoader";
import { LoadingPage, ErrorPage } from "./StatusPages";

const mapStyle = [
  {
    featureType: "all",
    stylers: [
      {
        visibility: "simplified"
      }
    ]
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  }
];

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
          disableDefaultUI: true,
          scaleControl: true,
          fullscreenControl: true,
          styles: mapStyle
        })
      );
    }
  }, [mapReady, map, google, mapsRef]);

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

export default LiveMap;
