import React from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import { getGPSProvider } from "../../common/GPSProvider";
import { LastFixState, LastFixArrow } from "../../util/LastFixState";
import { getPilotIcon, getPilotIconColor } from "../../common/PilotIcon";
import { styled, withStyles } from "@material-ui/styles";

const FirstRowLeft = styled(Typography)({ overflow: "hidden", flex: "1" });

const FirstRowRight = styled(Typography)({
  marginRight: ".2em",
  marginLeft: ".5em"
});

const SecondRow = styled(Typography)({
  display: "flex",
  justifyContent: "space-between",
  paddingLeft: ".5em"
});

const PilotExpansionPanelSummary = withStyles({
  root: {
    paddingLeft: "12px"
  },
  content: {
    overflow: "hidden",
    alignItems: "center",
    whiteSpace: "nowrap"
  }
})(ExpansionPanelSummary);

class AnimatedPilotListEntry extends React.PureComponent {
  constructor(props) {
    super(props);

    // Get initial data
    this.gpsData = getGPSProvider().getData();
    this.pilotColor = getPilotIconColor(this.props.pilotId);
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

  static renderHeight(pilotInfo) {
    const height =
      pilotInfo.gpsAlt !== null ? pilotInfo.gpsAlt : pilotInfo.baroAlt;

    return (
      Math.round(height) +
      "m (" +
      Math.round(Math.max(0, height - pilotInfo.elevation)) +
      "m)"
    );
  }

  static renderLastFixState(pilotInfo) {
    return LastFixState({
      timestamp: pilotInfo.newestDataTimestamp * 1000,
      landed: pilotInfo.landed,
      relative: true,
      showLastFix: false
    });
  }

  render() {
    const pilotData = getXContestInterface().animation.getData();
    const pilotInfo =
      this.props.pilotId in pilotData ? pilotData[this.props.pilotId] : null;

    console.log(
      "RENDER ",
      this.props.pilotId,
      this.state,
      this.props,
      pilotInfo
    );

    const pilotIcon = getPilotIcon(
      null,
      pilotInfo.startOfTrack,
      pilotInfo.endOfTrack,
      pilotInfo.landed,
      pilotInfo.pos,
      pilotInfo.velocityVec
    );

    return (
      <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
        <PilotExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            display="block"
            style={{ marginRight: "10px", flex: "0 0 auto" }}
          >
            <path d={pilotIcon.path} fill={this.pilotColor} stroke="black" />
          </svg>
          <div style={{ flex: "1 1 auto", overflow: "hidden" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                overflow: "hidden"
              }}
            >
              <FirstRowLeft variant="body2">
                {this.props.pilotName}
              </FirstRowLeft>
              <FirstRowRight variant="caption">
                <LastFixArrow lastFix={pilotInfo.pos} />
              </FirstRowRight>
            </div>
            <SecondRow variant="caption">
              <span>
                {AnimatedPilotListEntry.renderLastFixState(pilotInfo)}
              </span>
              <div>{AnimatedPilotListEntry.renderHeight(pilotInfo)}</div>
            </SecondRow>
          </div>
        </PilotExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>TODO: Details</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default AnimatedPilotListEntry;
