import { useEffect, useState } from "react";

export const usePosition = (displayErrors = false) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const onError = err => {
      console.log("GEOLOCATION ERROR: ", err);
      if (displayErrors) alert(err.message);
      setPosition(null);
    };

    const onChange = data => {
      setPosition(data);
    };

    const geo = navigator.geolocation;
    if (!geo) {
      if (displayErrors) alert("Error: Browser does not support geolocation!");
      return;
    }

    const settings = { enableHighAccuracy: true };

    let watcher = geo.watchPosition(onChange, onError, settings);
    return () => geo.clearWatch(watcher);
  }, [displayErrors]);

  return position;
};
