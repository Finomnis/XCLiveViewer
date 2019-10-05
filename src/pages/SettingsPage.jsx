import React, { useState } from "react";

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
  ListItemSecondaryAction,
  TextField,
  InputAdornment,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button
} from "@material-ui/core";
import UndoIcon from "@material-ui/icons/Undo";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  getSetting,
  Settings,
  resetAllSettings
} from "../common/PersistentState/Settings";

const NumberInput = props => (
  <TextField
    onChange={event => console.log(event, event.target.valueAsNumber)}
    variant="outlined"
    disabled={props.disabled}
    margin="dense"
    hiddenLabel
    type="number"
    value={props.value}
    InputProps={{
      endAdornment: <InputAdornment position="end">{props.unit}</InputAdornment>
    }}
    inputProps={{ min: props.min, max: props.max }}
  />
);

const SettingsPage = props => {
  const [resetAllSettingsDialogOpen, setResetAllSettingsDialogOpen] = useState(
    false
  );

  // Retreive the settings we want to change
  const [settingPathLength, setSettingPathLength] = getSetting(
    Settings.PATH_LENGTH
  ).use();
  const [settingLimitPaths, setSettingLimitPaths] = getSetting(
    Settings.LIMIT_PATHS
  ).use();
  const [settingLowLatency, setSettingLowLatency] = getSetting(
    Settings.LOW_LATENCY
  ).use();
  const [settingAnimationDelay, setSettingAnimationDelay] = getSetting(
    Settings.ANIMATION_DELAY
  ).use();
  const [settingFpsLimit, setSettingFpsLimit] = getSetting(
    Settings.FPS_LIMIT
  ).use();
  const [settingFpsRate, setSettingFpsRate] = getSetting(
    Settings.FPS_RATE
  ).use();

  const flipLimitPaths = () => setSettingLimitPaths(!settingLimitPaths);
  const flipLowLatency = () => setSettingLowLatency(!settingLowLatency);
  const flipFpsLimit = () => setSettingFpsLimit(!settingFpsLimit);

  return (
    <Dialog fullScreen open={props.open} onClose={props.onClose}>
      {/* THE TITLE BAR */}
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
      <Dialog
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
      </Dialog>

      {/* THE ACTUAL OPTIONS */}
      <List>
        {/* FRAMERATE */}
        <ListItem button onClick={flipFpsLimit}>
          <ListItemText
            primary="Limit Framerate"
            secondary="reduces energy consumption"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={flipFpsLimit}
              checked={settingFpsLimit}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem disabled={!settingFpsLimit}>
          <ListItemText primary="Framerate" secondary="Valid: 1-60 fps" />
          <ListItemSecondaryAction>
            <NumberInput
              value={settingFpsRate}
              onChange={setSettingFpsRate}
              disabled={!settingFpsLimit}
              unit="fps"
              min={1}
              max={60}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />

        {/* TRACK LENGTH */}
        <ListItem button onClick={flipLimitPaths}>
          <ListItemText
            primary="Limit Track Length"
            secondary="reduces data consumption"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={flipLimitPaths}
              checked={settingLimitPaths}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem disabled={!settingLimitPaths}>
          <ListItemText primary="Track Length" secondary="Valid: 1-999 min" />
          <ListItemSecondaryAction>
            <NumberInput
              disabled={!settingLimitPaths}
              value={settingPathLength}
              onChange={setSettingPathLength}
              unit="min"
              min={1}
              max={999}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />

        {/* ANIMATION DELAY */}
        <ListItem button onClick={flipLowLatency}>
          <ListItemText
            primary="Low Latency Mode"
            secondary="disables animations"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={flipLowLatency}
              checked={settingLowLatency}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem disabled={settingLowLatency}>
          <ListItemText
            primary="Animation Delay"
            secondary="70-120 sec (default: 80)"
          />
          <ListItemSecondaryAction>
            <NumberInput
              disabled={settingLowLatency}
              value={settingAnimationDelay}
              onChange={setSettingAnimationDelay}
              unit="sec"
              min={70}
              max={120}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default SettingsPage;
