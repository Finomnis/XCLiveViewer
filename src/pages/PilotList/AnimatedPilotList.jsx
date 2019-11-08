import React from "react";
import { Box } from "@material-ui/core";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import AnimatedPilotListEntry from "./AnimatedPilotListEntry";
import { getGPSProvider } from "../../common/GPSProvider";

class AnimatedPilotList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      onlinePilots: []
    };
    this.pilotData = null;
    this.gpsData = getGPSProvider().getData();
  }

  onNewDataReceived = pilotData => {
    this.pilotData = pilotData;
    let pilotList = Object.keys(pilotData);

    // TODO sort

    let pilotListChanged = false;
    if (pilotList.length === this.state.onlinePilots.length) {
      for (let i = 0; i < pilotList.length; i++) {
        if (pilotList[i] !== this.state.onlinePilots[i]) {
          pilotListChanged = true;
          break;
        }
      }
    } else {
      pilotListChanged = true;
    }

    if (pilotListChanged) {
      this.setState({ ...this.state, onlinePilots: pilotList });
    }
  };

  onNewGPSDataReceived = gpsData => {
    this.gpsData = gpsData;
  };

  componentDidMount() {
    getXContestInterface().animation.registerCallback(this.onNewDataReceived);
    getGPSProvider().registerCallback(this.onNewGPSDataReceived);
  }
  componentWillUnmount() {
    getXContestInterface().animation.unregisterCallback(this.onNewDataReceived);
    getGPSProvider().unregisterCallback(this.onNewGPSDataReceived);
  }

  render() {
    let pilotIsOnline = new Set(this.state.onlinePilots);

    // Show online pilots first
    let pilots = this.state.onlinePilots.filter(
      pilotId => pilotId in this.props.pilots
    );

    // Add all offline pilots
    pilots.push.apply(
      pilots,
      Object.keys(this.props.pilots).filter(
        pilotId => !pilotIsOnline.has(pilotId)
      )
    );

    return (
      <Box height="100%" bgcolor="#f5f5f5" overflow="auto">
        <Box margin={1}>
          {pilots.map(pilotId => (
            <AnimatedPilotListEntry
              key={pilotId}
              pilotId={pilotId}
              removePilot={() => {
                this.props.removePilots([pilotId]);
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }
}

export default AnimatedPilotList;
