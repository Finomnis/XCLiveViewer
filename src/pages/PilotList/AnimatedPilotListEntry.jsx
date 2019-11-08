import React, { Component } from "react";
import {
  Box,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import { getGPSProvider } from "../../common/GPSProvider";

class AnimatedPilotListEntry extends Component {
  constructor(props) {
    super(props);

    // Get initial data
    const pilotData = getXContestInterface().animation.getData();
    this.pilotInfo = null;
    if (props.pilotId in pilotData) {
      this.pilotInfo = pilotData[props.pilotId];
    }
    this.gpsData = getGPSProvider().getData();

    this.state = {
      online: this.pilotInfo !== null,
      gps: this.gpsData !== null
    };
  }

  //////////////////////////////////////////////////////////////
  /// BOILERPLATE CODE FOR UPDATING THE COMPONENT
  ///
  onNewGPSDataReceived = gpsData => {
    this.gpsData = gpsData;
    const hasGps = this.gpsData !== null;

    // If something major has changed, don't run a microupdate, but a full one
    if (this.state.gps !== hasGps) {
      this.setState({ ...this.state, gps: hasGps });
      return;
    }

    if (!hasGps) return;

    // TODO replace with a more efficient way
    this.forceUpdate();
  };

  onNewDataReceived = pilotData => {
    if (this.props.pilotId in pilotData) {
      this.pilotInfo = pilotData[this.props.pilotId];
    } else {
      this.pilotInfo = null;
    }

    const hasPilotInfo = this.pilotInfo !== null;

    // If something major has changed, don't run a microupdate, but a full one
    if (this.state.online !== hasPilotInfo) {
      this.setState({ ...this.state, online: true });
      return;
    }

    if (!hasPilotInfo) return;

    // TODO update data in a more efficient way, by modifying object dom directly
    this.forceUpdate();
  };

  componentDidMount() {
    getXContestInterface().animation.registerCallback(this.onNewDataReceived);
    getGPSProvider().registerCallback(this.onNewGPSDataReceived);
  }

  componentWillUnmount() {
    getXContestInterface().animation.unregisterCallback(this.onNewDataReceived);
    getGPSProvider().unregisterCallback(this.onNewGPSDataReceived);
  }
  ///
  /////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////
  /// LAYOUT
  ///
  render() {
    //const animatedPilotData = this.pilotInfo;

    return (
      <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Box>
            <Typography variant="body2">{"fullname"}</Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              style={{ paddingLeft: ".5em" }}
            >
              {"Username"}
            </Typography>
          </Box>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default AnimatedPilotListEntry;
