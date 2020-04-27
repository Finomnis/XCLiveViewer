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

export default class ContextMenu extends React.PureComponent {
  generateMenuEntry = (icon, text, action, disabled = false) => (
    <ListItem button onClick={action} disabled={disabled}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItem>
  );

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
        onClose={this.props.onClose}
      >
        <List component="nav" dense>
          {this.generateMenuEntry(
            <PlayArrowIcon />,
            "Show Pilot on Map",
            this.props.onShowOnMap
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
                this.props.onHidePilot
              )
            : this.generateMenuEntry(
                <StarRateIcon />,
                "Unhide Pilot",
                this.props.onUnhidePilot
              )}
          {this.generateMenuEntry(
            <RoomIcon />,
            "Open in Maps",
            this.props.onNavigateTo
          )}
          {this.generateMenuEntry(
            <DeleteIcon />,
            "Remove Pilot",
            this.props.onDelete
          )}
        </List>
      </Popover>
    );
  }
}
