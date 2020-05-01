import React from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import { getGPSProvider } from "../../services/GPSProvider";
import { LastFixState, LastFixArrow } from "../../util/LastFixState";
import { getPilotIcon, getPilotIconColor } from "../../common/PilotIcon";
import { styled, withStyles } from "@material-ui/styles";
import TimerIcon from "@material-ui/icons/Timer";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import FlagIcon from "@material-ui/icons/Flag";
import { getRotationStyle } from "../../util/Rotation";
import { getSetting, Settings } from "../../common/PersistentState/Settings";
import ContextMenuHandler from "../../util/ContextMenuHandler";
import { parseTime } from "../../location_provider/XContest/FlightAnimationData";
import { ElevationHistogram } from "./ElevationHistogram";

const FirstRowLeft = styled(Typography)({ overflow: "hidden", flex: "1" });

const FirstRowRight = styled(Typography)({
  marginRight: ".2em",
  marginLeft: ".5em",
});

const SecondRow = styled(Typography)({
  display: "flex",
  justifyContent: "space-between",
  paddingLeft: ".5em",
});

const PilotExpansionPanelSummary = withStyles({
  root: {
    paddingLeft: "12px",
  },
  content: {
    overflow: "hidden",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
})(ExpansionPanelSummary);

const PilotExpansionPanelDetails = withStyles({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
  },
})(ExpansionPanelDetails);

const DetailsStats = styled(Typography)({
  flex: "1 0 0",
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  alignItems: "flex-start",
  paddingRight: "1em",
});

const DetailsGraph = styled(Typography)({
  flex: "2 1 0",
  display: "flex",
});

const DetailsRow = styled(Typography)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  whiteSpace: "nowrap",
});

const DetailTimerIcon = withStyles({
  root: {
    paddingRight: ".2em",
    width: ".6em",
    height: ".6em",
  },
})(TimerIcon);
const DetailDistanceIcon = withStyles({
  root: {
    paddingRight: ".2em",
    width: ".6em",
    height: ".6em",
  },
})(DoubleArrowIcon);
const DetailLaunchIcon = withStyles({
  root: {
    paddingRight: ".2em",
    width: ".6em",
    height: ".6em",
  },
})(FlagIcon);

class AnimatedPilotListEntry extends React.PureComponent {
  constructor(props) {
    super(props);

    // Get initial data
    this.gpsData = getGPSProvider().getData();
    this.pilotColor = getPilotIconColor(this.props.pilotId);

    // Get initial pilotinfo
    this.state = {
      launchSite: null,
      launchTime: null,
      scoreDistance: null,
      scoreType: null,
    };
    Object.assign(
      this.state,
      this.stateChangesFromPilotInfos(
        this.state,
        getXContestInterface().getPilotInfos()
      )
    );

    // References
    this.lastFixRef = React.createRef();
    this.heightRef = React.createRef();
    this.liveStateRef = React.createRef();
    this.iconRef = React.createRef();
    this.flightDurationRef = React.createRef();

    this.contextMenuHandler = new ContextMenuHandler((e) => {
      this.props.onContextMenuHandler(this.props.pilotId, {
        left: e.pageX,
        top: e.pageY,
      });
    });
  }

  //////////////////////////////////////////////////////////////
  /// BOILERPLATE CODE FOR UPDATING THE COMPONENT
  ///
  extractImportantProps = (pilotInfo) => {
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
      velocity: pilotInfo.velocity,
      lastPotentialAirTime: pilotInfo.lastPotentialAirTime,
    };
  };

  propsChanged = (newProps) => {
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

  onNewGPSDataReceived = (gpsData) => {
    this.gpsData = gpsData;
  };

  onNewDataReceived = ({ pilotData }) => {
    if (!(this.props.pilotId in pilotData)) return;

    const pilotInfo = pilotData[this.props.pilotId];
    const newPilotProps = this.extractImportantProps(pilotInfo);

    // Run shallow update without touching React
    if (this.propsChanged(newPilotProps)) {
      this.pilotProps = newPilotProps;
      this.shallowRerender(true);
    } else {
      // If props didn't change, rerender anyways to update time stamps and time-dependent data
      this.shallowRerender(false);
    }
  };

  onNewPilotInfos = (infos) => {
    const stateChanges = this.stateChangesFromPilotInfos(this.state, infos);
    if (Object.keys(stateChanges).length !== 0) {
      this.setState(stateChanges);
    }
  };

  stateChangesFromPilotInfos = (oldState, allInfos) => {
    const stateChanges = {};

    const processInfo = (name, value) => {
      if (name in oldState && oldState[name] === value) {
        return;
      }
      stateChanges[name] = value;
    };

    if (this.props.pilotId in allInfos) {
      const infos = allInfos[this.props.pilotId];

      processInfo("launchSite", infos.info.launch);
      processInfo("launchTime", parseTime(infos.info.launchPoint.timestamp));

      if ("contest" in infos && "score" in infos.contest) {
        const score = infos.contest.score;
        if (score.distance != null)
          processInfo("scoreDistance", score.distance.toFixed(1));
        if ("type" in score) {
          processInfo("scoreType", score.type.tag);
        }
      }
    }
    return stateChanges;
  };

  shallowRerender = (propsChanged) => {
    // Update height
    if (this.heightRef.current !== null && propsChanged) {
      const newHeight = AnimatedPilotListEntry.renderHeight(this.pilotProps);
      if (newHeight !== this.heightRef.current.innerHTML)
        this.heightRef.current.innerHTML = newHeight;
    }

    // Update distance and direction
    if (this.lastFixRef.current !== null && propsChanged) {
      this.lastFixRef.current.setFix({
        lat: this.pilotProps.lat,
        lng: this.pilotProps.lng,
      });
    }

    // Update Pilot Icon
    if (this.iconRef.current !== null && propsChanged) {
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

    // Update Live State
    if (this.liveStateRef.current !== null) {
      this.liveStateRef.current.shallowRerender({
        timestamp: this.pilotProps.newestDataTimestamp * 1000,
        landed: this.pilotProps.landed,
        endOfTrack: this.pilotProps.endOfTrack,
        relative: true,
        showLastFix: getSetting(Settings.LOW_LATENCY).getValue(),
      });
    }

    // Update Flight Duration
    if (this.flightDurationRef.current !== null && propsChanged) {
      const newFlightDuration = AnimatedPilotListEntry.renderFlightDuration(
        this.state.launchTime,
        this.pilotProps.lastPotentialAirTime
      );
      if (newFlightDuration !== this.flightDurationRef.current.innerHTML)
        this.flightDurationRef.current.innerHTML = newFlightDuration;
    }
  };

  componentDidMount() {
    getXContestInterface().animation.registerCallback(this.onNewDataReceived);
    getXContestInterface().pilotInfos.registerCallback(this.onNewPilotInfos);
    getGPSProvider().registerCallback(this.onNewGPSDataReceived);
  }

  componentWillUnmount() {
    getXContestInterface().animation.unregisterCallback(this.onNewDataReceived);
    getXContestInterface().pilotInfos.unregisterCallback(this.onNewPilotInfos);
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

  static renderFlightDuration(launchTime, currentTime) {
    if (launchTime == null || currentTime == null) return "-:-- h";

    const duration = Math.round((currentTime - launchTime) / 60);
    const durationMinutes = (duration % 60).toString().padStart(2, "0");
    const durationHours = Math.floor(duration / 60);
    return durationHours + ":" + durationMinutes + " h";
  }

  static scoreTypes = {
    FlatTriangle: " (flat)",
    FaiTriangle: " (fai)",
    FreeFlight: " (free)",
  };

  static renderScore(scoreDistance, scoreType) {
    const scoreTypeStr =
      scoreType in AnimatedPilotListEntry.scoreTypes
        ? AnimatedPilotListEntry.scoreTypes[scoreType]
        : scoreType;
    return scoreDistance + " km " + scoreTypeStr;
  }

  render() {
    {
      const pilotData = getXContestInterface().animation.getData().pilotData;
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
      <ExpansionPanel
        TransitionProps={{ unmountOnExit: true }}
        onContextMenu={this.contextMenuHandler.onContextMenu}
        onTouchStart={this.contextMenuHandler.onTouchStart}
        onTouchCancel={this.contextMenuHandler.onTouchCancel}
        onTouchEnd={this.contextMenuHandler.onTouchEnd}
        onTouchMove={this.contextMenuHandler.onTouchMove}
        style={{
          filter: this.props.shown ? undefined : "grayscale(100%) opacity(70%)",
        }}
      >
        <PilotExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            display="block"
            style={{
              flex: "0 0 auto",
              ...getRotationStyle(pilotIconRotation),
            }}
            ref={this.iconRef}
          >
            <path d={pilotIcon.path} fill={this.pilotColor} stroke="black" />
          </svg>
          <div
            style={{
              flex: "1 1 auto",
              overflow: "hidden",
              marginLeft: "10px",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                overflow: "hidden",
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
                    lng: this.pilotProps.lng,
                  }}
                />
              </FirstRowRight>
            </div>
            <SecondRow variant="caption">
              <LastFixState
                timestamp={this.pilotProps.newestDataTimestamp * 1000}
                landed={this.pilotProps.landed}
                endOfTrack={this.pilotProps.endOfTrack}
                relative
                ref={this.liveStateRef}
                showLastFix={getSetting(Settings.LOW_LATENCY).getValue()}
              />
              <span ref={this.heightRef}>
                {AnimatedPilotListEntry.renderHeight(this.pilotProps)}
              </span>
            </SecondRow>
          </div>
        </PilotExpansionPanelSummary>
        <PilotExpansionPanelDetails>
          <DetailsStats>
            <DetailsRow variant="caption">
              <DetailTimerIcon />
              <span ref={this.flightDurationRef}>
                {AnimatedPilotListEntry.renderFlightDuration(
                  this.state.launchTime,
                  this.pilotProps.lastPotentialAirTime
                )}
              </span>
            </DetailsRow>
            <DetailsRow variant="caption">
              <DetailDistanceIcon />
              {AnimatedPilotListEntry.renderScore(
                this.state.scoreDistance,
                this.state.scoreType
              )}
            </DetailsRow>
            <DetailsRow variant="caption">
              <DetailLaunchIcon /> {this.state.launchSite}
            </DetailsRow>
          </DetailsStats>
          <DetailsGraph variant="caption">
            <ElevationHistogram pilot={this.props.pilotId} />
          </DetailsGraph>
        </PilotExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default AnimatedPilotListEntry;
