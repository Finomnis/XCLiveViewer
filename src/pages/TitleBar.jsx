import React from "react";
import { useState } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Badge from "@material-ui/core/Badge";

import MenuIcon from "@material-ui/icons/Menu";
import ErrorIcon from "@material-ui/icons/ErrorRounded";
import SignalCellular4BarIcon from "@material-ui/icons/SignalCellular4Bar";
import SignalCellularConnectedNoInternet4BarIcon from "@material-ui/icons/SignalCellularConnectedNoInternet4Bar";
import SignalCellularNullIcon from "@material-ui/icons/SignalCellularNull";

import { useXContestConnectionState } from "../location_provider/XContest/XContestInterface";
import { ConnectionState } from "../location_provider/XContest/XContestInterface";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  popover: {
    padding: theme.spacing(1),
    align: "right"
  }
}));

const LoadingBadge = props => {
  return (
    <Badge
      //overlap="circle"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      badgeContent={
        <CircularProgress
          disableShrink={props.disableShrink}
          color="secondary"
          size={15}
          thickness={10}
        />
      }
    >
      {props.children}
    </Badge>
  );
};

const TitleBar = () => {
  const classes = useStyles();
  const connectionState = useXContestConnectionState();

  const [connectionPopAnchor, setConnectionPopAnchor] = useState(null);

  const renderConnectionIcon = () => {
    switch (connectionState) {
      case ConnectionState.ACTIVE:
        return <SignalCellular4BarIcon />;
      case ConnectionState.CONNECTING:
        return (
          <LoadingBadge>
            <SignalCellularNullIcon />
          </LoadingBadge>
        );
      case ConnectionState.ERROR:
        return <ErrorIcon color="error" />;
      case ConnectionState.ESTABLISHED:
        return (
          <LoadingBadge disableShrink>
            <SignalCellularNullIcon />
          </LoadingBadge>
        );
      case ConnectionState.INACTIVE:
        return <SignalCellularConnectedNoInternet4BarIcon />;
      case ConnectionState.NO_CONNECTION:
        return <SignalCellularNullIcon />;
      default:
        return <SignalCellularNullIcon />;
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Box clone>
            <IconButton
              className={classes.menuButton}
              edge="start"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box flexGrow={1} clone>
            <Typography variant="h6">XC Live Viewer</Typography>
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            onClick={event => setConnectionPopAnchor(event.currentTarget)}
          >
            {renderConnectionIcon()}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Popover
        open={Boolean(connectionPopAnchor)}
        anchorEl={connectionPopAnchor}
        onClose={() => setConnectionPopAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Box className={classes.popover}>
          <Typography>{connectionState}</Typography>
        </Box>
      </Popover>
    </div>
  );
};

export default TitleBar;
