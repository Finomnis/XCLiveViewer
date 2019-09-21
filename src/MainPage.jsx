import React from "react";
import Box from "@material-ui/core/Box";
import SwipeableViews from "react-swipeable-views";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";

import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import MapIcon from "@material-ui/icons/Map";

import "./MainPage.css";

export default function MainPage() {
  const [tabId, setTabId] = React.useState(0);

  const handleNavigationButton = (_event, newValue) => setTabId(newValue);
  const handleSwipeChange = value => setTabId(value);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Box flexGrow={1} clone>
        <SwipeableViews index={tabId} onChangeIndex={handleSwipeChange}>
          <div>Item One</div>
          <div>Item Two</div>
          <div>Item Three</div>
        </SwipeableViews>
      </Box>
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
  );
}
