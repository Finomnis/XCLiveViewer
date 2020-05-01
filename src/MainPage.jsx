import React from "react";
import Box from "@material-ui/core/Box";
import SwipeableViews from "react-swipeable-views";
import {
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import PeopleIcon from "@material-ui/icons/People";
import MapIcon from "@material-ui/icons/Map";

import "./MainPage.css";

// TODO import LazyLoading from "./util/LazyLoading";

import LiveMap from "./pages/GoogleMapsPage/LiveMap_new";
import Pilots from "./pages/PilotList/Pilots";
import TitleBar from "./pages/TitleBar";

import PageState from "./common/PersistentState/PageState";

const MainPage = () => {
  const [tabId, setTabId] = PageState.TabID.use();
  const [windowHeight, setWindowHeight] = React.useState(0);
  const theme = useTheme();
  const isSmartphone = useMediaQuery(theme.breakpoints.down("sm"));

  // Workaround for mobile screens reporting an incorrect window height
  const updateWindowHeight = () => {
    setWindowHeight(window.innerHeight);
  };
  React.useLayoutEffect(() => {
    updateWindowHeight();
    window.addEventListener("resize", updateWindowHeight);
    return () => window.removeEventListener("resize", updateWindowHeight);
  }, []);

  // Callbacks for changing the current page
  const handleNavigationButton = (_event, newValue) => setTabId(newValue);

  const content = isSmartphone ? (
    <React.Fragment>
      <Box flexGrow={1} clone display="flex">
        <SwipeableViews disabled index={tabId}>
          <Box width="100%" height="100%" position="relative">
            <LiveMap></LiveMap>
          </Box>
          <Box width="100%" height="100%" position="relative">
            <Pilots></Pilots>
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
          <BottomNavigationAction label="Pilots" icon={<PeopleIcon />} />
        </BottomNavigation>
      </Box>
    </React.Fragment>
  ) : (
    <Box width="100%" flexGrow={1} display="flex" overflow="hidden">
      <Box flexGrow={1} height="100%">
        <LiveMap></LiveMap>
      </Box>
      <Box width="450px" height="100%" zIndex={50} boxShadow={3}>
        <Pilots></Pilots>
      </Box>
    </Box>
  );

  return (
    <Box
      height={windowHeight}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Box zIndex={100}>
        <TitleBar></TitleBar>
      </Box>

      {content}
    </Box>
  );
};

export default MainPage;
