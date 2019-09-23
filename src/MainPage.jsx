import React from "react";
import Box from "@material-ui/core/Box";
import SwipeableViews from "react-swipeable-views";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";

import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import MapIcon from "@material-ui/icons/Map";

import "./MainPage.css";

// TODO import LazyLoading from "./util/LazyLoading";

import LiveMap from "./pages/LiveMap";
import PilotSelector from "./pages/PilotSelector";

export default function MainPage() {
  const [tabId, setTabId] = React.useState(1);
  const [windowHeight, setWindowHeight] = React.useState(0);

  // Workaround for mobile screens reporting an incorrect window height
  const updateWindowHeight = () => {
    setWindowHeight(window.innerHeight);
  };
  React.useEffect(() => {
    updateWindowHeight();
    window.addEventListener("resize", updateWindowHeight);
    return () => window.removeEventListener("resize", updateWindowHeight);
  }, []);

  // Callbacks for changing the current page
  const handleNavigationButton = (_event, newValue) => setTabId(newValue);

  return (
    <Box height={windowHeight} display="flex" flexDirection="column">
      <Box flexGrow={1} clone>
        <SwipeableViews disabled index={tabId}>
          <Box width="100%" height="100%">
            <LiveMap></LiveMap>
          </Box>
          <Box width="100%" height="100%">
            <PilotSelector></PilotSelector>
          </Box>
          <Box width="100%" height="100%">
            Item Three
          </Box>
        </SwipeableViews>
      </Box>
      <Box zIndex={100} boxShadow={3}>
        <BottomNavigation
          value={tabId}
          onChange={handleNavigationButton}
          showLabels
        >
          <BottomNavigationAction label="Map" icon={<MapIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </Box>
    </Box>
  );
}
