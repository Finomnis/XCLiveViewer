import { useState, useEffect } from "react";
import { Loader } from "@googlemaps/loader";

// Hook
let googleMapsApiPromise = null;
function useGoogleMapsApi() {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    ready: false,
    error: false
  });

  useEffect(
    () => {
      if (googleMapsApiPromise === null) {
        googleMapsApiPromise = new Loader({
          apiKey: process.env.REACT_APP_GAPI_KEY
        }).load();
      }

      let promiseParameters = { gotCanceled: false };
      googleMapsApiPromise
        .then(() => {
          if (promiseParameters.gotCanceled) return;
          console.log("Google Maps API loaded.");
          setState({
            ready: true,
            error: false
          });
        })
        .catch(e => {
          if (promiseParameters.gotCanceled) return;
          console.log("Error: Cannot load Google Maps API:", e);
          setState({
            ready: false,
            error: true
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

export default useGoogleMapsApi;
