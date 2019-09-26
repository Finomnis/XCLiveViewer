import { useState, useEffect } from "react";

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
        googleMapsApiPromise = new Promise((resolve, _reject) => {
          console.log("Loading Google Maps API ...");
          // Create script
          let script = document.createElement("script");
          script.src =
            "https://maps.googleapis.com/maps/api/js?key=" +
            process.env.REACT_APP_GAPI_KEY;
          script.async = true;

          script.addEventListener("load", () => resolve(true));
          script.addEventListener("error", () => resolve(false));

          // Add script to document body
          document.body.appendChild(script);
        });
      }

      googleMapsApiPromise.then(success => {
        if (success) {
          console.log("Google Maps API loaded.");
          setState({
            ready: true,
            error: false
          });
        } else {
          console.log("Error: Cannot load Google Maps API.");
          setState({
            ready: false,
            error: true
          });
        }
      });
    },
    [] // Don't re-run
  );

  return [state.ready, state.error, state.ready ? window.google : null];
}

export default useGoogleMapsApi;
