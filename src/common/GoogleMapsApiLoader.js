import { useState, useEffect } from "react";
import { Loader } from "@googlemaps/loader";

// Global google maps api singleton
let googleMapsApiPromise = null;
export function loadGoogleMapsApi() {
  if (googleMapsApiPromise === null) {
    googleMapsApiPromise = new Loader({
      apiKey: process.env.REACT_APP_GAPI_KEY,
    }).load();
  }
  return googleMapsApiPromise;
}

// Hook
export function useGoogleMapsApi() {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    ready: false,
    error: false,
  });

  useEffect(
    () => {
      let promiseParameters = { gotCanceled: false };
      loadGoogleMapsApi()
        .then(() => {
          if (promiseParameters.gotCanceled) return;
          console.log("Google Maps API loaded.");
          setState({
            ready: true,
            error: false,
          });
        })
        .catch((e) => {
          if (promiseParameters.gotCanceled) return;
          console.log("Error: Cannot load Google Maps API:", e);
          setState({
            ready: false,
            error: true,
          });
        });

      return () => {
        promiseParameters.gotCanceled = true;
      };
    },
    [] // Don't re-run
  );

  return [state.ready, state.error, state.ready ? window.google : null];
}
