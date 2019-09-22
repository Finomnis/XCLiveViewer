import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import useGoogleMapsApi from "../ext/GoogleMapsApiLoader";
import { LoadingPage, ErrorPage } from "./StatusPages";

const LiveMap = () => {
  const [mapReady, mapError, google] = useGoogleMapsApi();
  const mapsRef = useState(React.createRef())[0];
  const [map, setMap] = useState(null);

  // Initialize Map
  useEffect(() => {
    if (mapReady && !map) {
      setMap(
        new google.maps.Map(mapsRef.current, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8
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
