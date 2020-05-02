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
  useTheme,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SettingsIcon from "@material-ui/icons/Settings";
import ShareIcon from "@material-ui/icons/Share";

import SettingsPage from "./SettingsPage/SettingsPage";
import LinkCreator from "./LinkCreator/LinkCreator";

const MainMenu = (props) => {
  const theme = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [linkCreatorOpen, setLinkCreatorOpen] = useState(false);

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
            minWidth: "200px",
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
          <ListItem
            button
            onClick={() => {
              props.onClose();
              setLinkCreatorOpen(true);
            }}
          >
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText primary="Create Pilot Link" />
          </ListItem>
        </List>
        <Typography
          variant="caption"
          style={{
            fontSize: "0.6rem",
            textAlign: "center",
            position: "absolute",
            bottom: "0px",
            width: "100%",
          }}
        >
          {"Icon made by "}
          <a href="https://www.flaticon.com/authors/freepik">{"Freepik"}</a>
          {" from "}
          <a href="https://www.flaticon.com/">{"www.flaticon.com"}</a>
        </Typography>
      </SwipeableDrawer>
      <SettingsPage
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      ></SettingsPage>
      <LinkCreator
        open={linkCreatorOpen}
        onClose={() => setLinkCreatorOpen(false)}
      ></LinkCreator>
    </React.Fragment>
  );
};

export default MainMenu;
