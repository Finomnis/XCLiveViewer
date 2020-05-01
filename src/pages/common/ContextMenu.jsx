import React from "react";

import {
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
} from "@material-ui/core";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DeleteIcon from "@material-ui/icons/Delete";
//import DirectionsIcon from "@material-ui/icons/Directions";
import StarRateIcon from "@material-ui/icons/StarRate";
import RoomIcon from "@material-ui/icons/Room";
import { navigateTo } from "../../util/MapLinks";
import PageState from "../../common/PersistentState/PageState";
import {
  setPilotShown,
  removePilots,
} from "../../common/PersistentState/ChosenPilots";
import { getMapViewportControllerService } from "../../services/MapViewportControllerService";

export default class ContextMenu extends React.PureComponent {
  generateMenuEntry = (icon, text, action, disabled = false) => (
    <ListItem
      button
      onClick={disabled ? undefined : action}
      disabled={disabled}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItem>
  );

  close = () => {
    this.props.onClose();
  };

  onDelete = () => {
    const pilotId = this.props.data.pilotId;
    removePilots([pilotId]);

    this.close();
  };

  onNavigateTo = () => {
    const lastFix = this.props.data.pilotInfo.lastFix;
    navigateTo({ lat: lastFix.lat, lng: lastFix.lon });

    this.close();
  };

  onShowOnMap = () => {
    const pilotId = this.props.data.pilotId;
    PageState.switchToMap();
    getMapViewportControllerService().setSinglePilotMode(pilotId);

    this.close();
  };

  onHidePilot = () => {
    const pilotId = this.props.data.pilotId;
    setPilotShown(pilotId, false);

    this.close();
  };

  onUnhidePilot = () => {
    const pilotId = this.props.data.pilotId;
    setPilotShown(pilotId, true);

    this.close();
  };

  render() {
    const { data } = this.props;

    const onMap = "onMap" in this.props;
    const offline = data !== null ? data.offline : null;
    const lastFix = data !== null ? data.pilotInfo.lastFix : null;

    return (
      <Popover
        open={data !== null && data.open}
        anchorReference="anchorPosition"
        anchorPosition={data === null ? null : data.pos}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={this.close}
      >
        <List
          dense
          subheader={
            onMap && data !== null ? (
              <ListSubheader>
                {data === null ? null : data.pilotInfo.name}
              </ListSubheader>
            ) : null
          }
        >
          {!onMap && !offline
            ? this.generateMenuEntry(
                <PlayArrowIcon />,
                "Show Pilot on Map",
                this.onShowOnMap
              )
            : null}
          {/*this.generateMenuEntry(
            <DirectionsIcon />,
            "Live Navigation",
            () => {},
            true
          )*/}
          {offline
            ? null
            : data !== null && data.pilotInfo.shown
            ? this.generateMenuEntry(
                <StarRateIcon />,
                "Hide Pilot",
                this.onHidePilot
              )
            : this.generateMenuEntry(
                <StarRateIcon />,
                "Unhide Pilot",
                this.onUnhidePilot
              )}
          {this.generateMenuEntry(
            <RoomIcon />,
            offline ? "Last Observed Position" : "Open in Maps",
            this.onNavigateTo,
            lastFix === null
          )}
          {this.generateMenuEntry(
            <DeleteIcon />,
            "Remove Pilot",
            this.onDelete
          )}
        </List>
      </Popover>
    );
  }
}
