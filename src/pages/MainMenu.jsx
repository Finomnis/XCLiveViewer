import React, { useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Toolbar,
  useTheme
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SettingsIcon from "@material-ui/icons/Settings";

import SettingsPage from "./SettingsPage/SettingsPage";

const MainMenu = props => {
  const theme = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <React.Fragment>
      <SwipeableDrawer
        disableSwipeToOpen
        open={props.open}
        onOpen={() => {}}
        onClose={props.onClose}
      >
        <Toolbar
          style={{
            backgroundColor: theme.palette.primary.light,
            minWidth: "200px"
          }}
          onClick={props.onClose}
        >
          <Box flexGrow={1} clone>
            <Typography variant="h6">Menu</Typography>
          </Box>
          <IconButton edge="end" color="inherit">
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>

        <List>
          <ListItem
            button
            onClick={() => {
              props.onClose();
              setSettingsOpen(true);
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </SwipeableDrawer>
      <SettingsPage
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      ></SettingsPage>
    </React.Fragment>
  );
};

export default MainMenu;
