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
    this.pilotData = getXContestInterface().animation.getData();
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

  removePilot = pilotId => {
    this.props.removePilots([pilotId]);
  };

  render() {
    let pilotIsOnline = new Set(this.state.onlinePilots);

    // Show online pilots first
    const onlinePilots = this.state.onlinePilots.filter(
      pilotId => pilotId in this.props.pilots
    );

    const offlinePilots = Object.keys(this.props.pilots).filter(
      pilotId => !pilotIsOnline.has(pilotId)
    );

    const getPilotName = pilotId => {
      const name = this.props.pilots[pilotId];
      if (name === undefined || name === null) return pilotId;
      return name;
    };

    return (
      <Box height="100%" bgcolor="#ddd" overflow="auto">
        <Box margin={1}>
          {onlinePilots.map(pilotId => (
            <AnimatedPilotListEntry
              key={pilotId}
              pilotId={pilotId}
              pilotName={getPilotName(pilotId)}
              online={true}
              removePilot={this.removePilot}
            />
          ))}
        </Box>
        <Box margin={1}>
          {offlinePilots.map(pilotId => (
            <AnimatedPilotListEntry
              key={pilotId}
              pilotId={pilotId}
              pilotName={getPilotName(pilotId)}
              online={false}
              removePilot={this.removePilot}
            />
          ))}
        </Box>
      </Box>
    );
  }
}

export default AnimatedPilotList;
