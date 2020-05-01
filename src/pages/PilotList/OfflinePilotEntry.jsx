import React from "react";
import { Typography, withStyles, Paper } from "@material-ui/core";
import ContextMenuHandler from "../../util/ContextMenuHandler";

const OfflinePilotPaper = withStyles({
  root: {
    display: "flex",
    backgroundColor: "#ccc",
    padding: ".8em",
  },
})(Paper);

export default class OfflinePilotEntry extends React.PureComponent {
  constructor(props) {
    super(props);

    this.contextMenuHandler = new ContextMenuHandler((e) => {
      this.props.onContextMenuHandler(this.props.pilotId, {
        left: e.pageX,
        top: e.pageY,
      });
    });
  }

  render() {
    return (
      <OfflinePilotPaper
        className="MuiExpansionPanel-rounded MuiExpansionPanel-root"
        onContextMenu={this.contextMenuHandler.onContextMenu}
        onTouchStart={this.contextMenuHandler.onTouchStart}
        onTouchCancel={this.contextMenuHandler.onTouchCancel}
        onTouchEnd={this.contextMenuHandler.onTouchEnd}
        onTouchMove={this.contextMenuHandler.onTouchMove}
      >
        <Typography variant="body2">{this.props.pilotName}</Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ paddingLeft: ".5em" }}
        >
          [{this.props.pilotId}]
        </Typography>
      </OfflinePilotPaper>
    );
  }
}
