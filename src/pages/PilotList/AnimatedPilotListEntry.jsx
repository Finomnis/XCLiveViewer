import React from "react";
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

class AnimatedPilotListEntry extends React.PureComponent {
  constructor(props) {
    super(props);

    // Get initial data
    this.gpsData = getGPSProvider().getData();
  }

  //////////////////////////////////////////////////////////////
  /// BOILERPLATE CODE FOR UPDATING THE COMPONENT
  ///
  onNewGPSDataReceived = gpsData => {
    this.gpsData = gpsData;
  };

  onNewDataReceived = pilotData => {
    if (!(this.props.pilotId in pilotData)) return;

    //const pilotInfo = pilotData[this.props.pilotId];

    // TODO update data in a more efficient way, by modifying object dom directly
    //this.forceUpdate();
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
    //const pilotData = getXContestInterface().animation.getData();
    //const pilotInfo =
    //  this.props.pilotId in pilotData ? pilotData[this.props.pilotId] : null;

    console.log("RENDER ", this.props.pilotId, this.state, this.props);
    //const animatedPilotData = this.pilotInfo;

    return (
      <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Box>
            <Typography variant="body2">{this.props.pilotName}</Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              style={{ paddingLeft: ".5em" }}
            >
              {"--"}
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
