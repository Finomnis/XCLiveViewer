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
import { getRotationStyle } from "../../util/Rotation";

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

    // References
    this.lastFixRef = React.createRef();
    this.heightRef = React.createRef();
    this.liveStateRef = React.createRef();
    this.iconRef = React.createRef();
  }

  //////////////////////////////////////////////////////////////
  /// BOILERPLATE CODE FOR UPDATING THE COMPONENT
  ///
  extractImportantProps = pilotInfo => {
    return {
      height: pilotInfo.gpsAlt !== null ? pilotInfo.gpsAlt : pilotInfo.baroAlt,
      elevation: pilotInfo.elevation,
      vario: pilotInfo.baroVario,
      startOfTrack: pilotInfo.startOfTrack,
      endOfTrack: pilotInfo.endOfTrack,
      landed: pilotInfo.landed,
      newestDataTimestamp: pilotInfo.newestDataTimestamp,
      lat: pilotInfo.pos.lat,
      lng: pilotInfo.pos.lng,
      velocityLat:
        pilotInfo.velocityVec === null ? null : pilotInfo.velocityVec.lat,
      velocityLng:
        pilotInfo.velocityVec === null ? null : pilotInfo.velocityVec.lng,
      velocity: pilotInfo.velocity
    };
  };

  propsChanged = newProps => {
    const oldProps = this.pilotProps;
    for (let p in oldProps) {
      if (!(p in newProps)) return true;
    }
    for (let p in newProps) {
      if (!(p in oldProps)) return true;
      if (oldProps[p] !== newProps[p]) return true;
    }
    return false;
  };

  onNewGPSDataReceived = gpsData => {
    this.gpsData = gpsData;
  };

  onNewDataReceived = pilotData => {
    if (!(this.props.pilotId in pilotData)) return;

    const pilotInfo = pilotData[this.props.pilotId];
    const newPilotProps = this.extractImportantProps(pilotInfo);

    if (!this.propsChanged(newPilotProps)) return;

    // Run shallow update without touching React
    this.pilotProps = newPilotProps;
    this.shallowRerender();
  };

  shallowRerender = () => {
    // Update height
    if (this.heightRef.current !== null) {
      const newHeight = AnimatedPilotListEntry.renderHeight(this.pilotProps);
      if (newHeight !== this.heightRef.current.innerHTML)
        this.heightRef.current.innerHTML = newHeight;
    }

    // Update distance and direction
    if (this.lastFixRef.current !== null) {
      this.lastFixRef.current.setFix({
        lat: this.pilotProps.lat,
        lng: this.pilotProps.lng
      });
    }

    // Update Pilot Icon
    if (this.iconRef.current !== null) {
      let icon = this.iconRef.current;

      const newPilotIcon = getPilotIcon(
        this.pilotProps.startOfTrack,
        this.pilotProps.endOfTrack,
        this.pilotProps.landed,
        { lat: this.pilotProps.lat, lng: this.pilotProps.lng },
        { lat: this.pilotProps.velocityLat, lng: this.pilotProps.velocityLng }
      );

      // Update svg path if necessary
      if (icon.childNodes.length > 0) {
        const path = icon.childNodes[0];
        const oldPath = path.getAttribute("d");
        if (oldPath !== newPilotIcon.path) {
          path.setAttribute("d", newPilotIcon.path);
        }
      }

      // Update rotation if necessary
      const rotation =
        newPilotIcon.rotation === undefined ? 0 : newPilotIcon.rotation;
      Object.assign(icon.style, getRotationStyle(rotation));
    }
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

  static renderHeight(pilotProps) {
    const height = pilotProps.height;

    return (
      Math.round(height) +
      "m (" +
      Math.round(Math.max(0, height - pilotProps.elevation)) +
      "m)"
    );
  }

  static renderLiveState(pilotProps) {
    // TODO fix somehow to make it animatable
    return LastFixState({
      timestamp: pilotProps.newestDataTimestamp * 1000,
      landed: pilotProps.landed,
      relative: true,
      showLastFix: false
    });
  }

  render() {
    {
      const pilotData = getXContestInterface().animation.getData();
      const pilotInfo =
        this.props.pilotId in pilotData ? pilotData[this.props.pilotId] : null;
      this.pilotProps = this.extractImportantProps(pilotInfo);
    }

    console.log(
      "RENDER ",
      this.props.pilotId,
      this.state,
      this.props,
      this.pilotProps
    );

    const pilotIcon = getPilotIcon(
      this.pilotProps.startOfTrack,
      this.pilotProps.endOfTrack,
      this.pilotProps.landed,
      { lat: this.pilotProps.lat, lng: this.pilotProps.lng },
      { lat: this.pilotProps.velocityLat, lng: this.pilotProps.velocityLng }
    );
    const pilotIconRotation =
      pilotIcon.rotation === undefined ? 0 : pilotIcon.rotation;

    return (
      <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
        <PilotExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            display="block"
            style={{
              flex: "0 0 auto",
              ...getRotationStyle(pilotIconRotation)
            }}
            ref={this.iconRef}
          >
            <path d={pilotIcon.path} fill={this.pilotColor} stroke="black" />
          </svg>
          <div
            style={{
              flex: "1 1 auto",
              overflow: "hidden",
              marginLeft: "10px"
            }}
          >
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
                <LastFixArrow
                  ref={this.lastFixRef}
                  lastFix={{
                    lat: this.pilotProps.lat,
                    lng: this.pilotProps.lng
                  }}
                />
              </FirstRowRight>
            </div>
            <SecondRow variant="caption">
              <span ref={this.liveStateRef}>
                {AnimatedPilotListEntry.renderLiveState(this.pilotProps)}
              </span>
              <span ref={this.heightRef}>
                {AnimatedPilotListEntry.renderHeight(this.pilotProps)}
              </span>
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
