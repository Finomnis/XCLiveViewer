import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

import MenuIcon from "@material-ui/icons/Menu";
import ErrorIcon from "@material-ui/icons/ErrorRounded";
import SignalCellular4BarIcon from "@material-ui/icons/SignalCellular4Bar";
import SignalCellularConnectedNoInternet4BarIcon from "@material-ui/icons/SignalCellularConnectedNoInternet4Bar";
import SignalCellularNullIcon from "@material-ui/icons/SignalCellularNull";
import SignalCellular0BarIcon from "@material-ui/icons/SignalCellular0Bar";

import { useXContestConnectionState } from "../location_provider/XContest/XContestInterface";
import { ConnectionState } from "../location_provider/XContest/XContestInterface";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

const TitleBar = () => {
  const classes = useStyles();
  const connectionState = useXContestConnectionState();

  const renderConnectionIcon = () => {
    switch (connectionState) {
      case ConnectionState.ACTIVE:
        return <SignalCellular4BarIcon />;
      case ConnectionState.CONNECTING:
        return <SignalCellularNullIcon />;
      case ConnectionState.ERROR:
        return <ErrorIcon color="error" />;
      case ConnectionState.ESTABLISHED:
        return <SignalCellular0BarIcon />;
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
            disableRipple
            disableFocusRipple
            edge="end"
            color="inherit"
          >
            {renderConnectionIcon()}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TitleBar;
