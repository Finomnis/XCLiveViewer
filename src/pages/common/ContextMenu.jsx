import React from "react";

import {
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
    <ListItem button onClick={action} disabled={disabled}>
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
    const pilotProps = this.props.data.props;
    navigateTo({ lat: pilotProps.lat, lng: pilotProps.lng });

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

    return (
      <Popover
        open={data !== null}
        anchorReference="anchorPosition"
        anchorPosition={data === null ? null : data.pos}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={this.close}
      >
        <List component="nav" dense>
          {"onMap" in this.props
            ? null
            : this.generateMenuEntry(
                <PlayArrowIcon />,
                "Show Pilot on Map",
                this.onShowOnMap
              )}
          {/*this.generateMenuEntry(
            <DirectionsIcon />,
            "Live Navigation",
            () => {},
            true
          )*/}
          {data !== null && data.shown
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
            "Open in Maps",
            this.onNavigateTo
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
