import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import UndoIcon from "@material-ui/icons/Undo";

import SubWindow from "../../util/SubWindow";
import { resetAllSettings } from "../../common/PersistentState/Settings";
import { pure } from "recompose";

const SettingsPageTitleBar = pure(props => {
  const [resetAllSettingsDialogOpen, setResetAllSettingsDialogOpen] = useState(
    false
  );

  return (
    <React.Fragment>
      <AppBar style={{ position: "static" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.onClose}>
            <ArrowBackIcon />
          </IconButton>

          <Box marginLeft={2} flexGrow={1}>
            <Typography variant="h6">Settings</Typography>
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setResetAllSettingsDialogOpen(true)}
          >
            <UndoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* RESET ALL SETTINGS DIALOG */}
      <SubWindow
        open={resetAllSettingsDialogOpen}
        onClose={() => setResetAllSettingsDialogOpen(false)}
      >
        <DialogTitle>{"Reset all settings?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This sets all settings to their default values.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              resetAllSettings();
              setResetAllSettingsDialogOpen(false);
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => setResetAllSettingsDialogOpen(false)}
            color="primary"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </SubWindow>
    </React.Fragment>
  );
});

export default SettingsPageTitleBar;
