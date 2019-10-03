import React from "react";

import {
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Switch,
  ListItemSecondaryAction
} from "@material-ui/core";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const SettingsPage = props => {
  return (
    <Dialog fullScreen open={props.open} onClose={props.onClose}>
      <AppBar style={{ position: "static" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.onClose}>
            <ArrowBackIcon />
          </IconButton>
          <Box marginLeft={2} flex="1">
            <Typography variant="h6">Settings</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <List>
        {/*TODO CHANGE*/}
        <ListItem button>
          <ListItemText primary="Phone ringtone" secondary="Titania" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText
            primary="Default notification ringtone"
            secondary="Tethys"
          />
          <ListItemSecondaryAction>
            <Switch edge="end" onChange={() => {}} checked={false} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default SettingsPage;
