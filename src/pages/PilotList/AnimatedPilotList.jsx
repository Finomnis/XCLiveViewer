import React from "react";
import { Box, Typography } from "@material-ui/core";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import AnimatedPilotListEntry from "./AnimatedPilotListEntry";
import { getGPSProvider } from "../../common/GPSProvider";
import { getDistance } from "geolib";

class AnimatedPilotList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      onlinePilots: []
    };
    this.gpsData = getGPSProvider().getData();

    // initial call to update the animation data
    this.onAnimationFrame(getXContestInterface().animation.getData());
  }

  getSortedPilotList = pilotData => {
    // If we have GPS, return pilot list in whatever order
    if (this.gpsData === null) return Object.keys(pilotData);

    // Get own position
    const myPos = {
      lat: this.gpsData.coords.latitude,
      lng: this.gpsData.coords.longitude
    };

    // Get distances to pilots
    let pilotsAndDistances = Object.entries(pilotData).map(([name, data]) => [
      name,
      getDistance(myPos, data.pos)
    ]);

    // Sort
    pilotsAndDistances.sort((el1, el2) => el1[1] - el2[1]);

    // Return the sorted pilot names
    return pilotsAndDistances.map(el => el[0]);
  };

  onAnimationFrame = pilotData => {
    // Sort
    const sortedPilotList = this.getSortedPilotList(pilotData);

    // Split pilots by landed and not landed
    const landedPilotList = sortedPilotList.filter(
      name => pilotData[name].endOfTrack && pilotData[name].landed
    );
    const notLandedPilotList = sortedPilotList.filter(
      name => !(pilotData[name].endOfTrack && pilotData[name].landed)
    );

    // Show landed pilots at the end of the list
    const pilotList = notLandedPilotList.concat(landedPilotList);

    // Check if the pilot list changed
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

    // If it changed, run a component update
    if (pilotListChanged) {
      this.setState(state => ({ ...state, onlinePilots: pilotList }));
    }
  };

  onNewGPSDataReceived = gpsData => {
    this.gpsData = gpsData;
  };

  componentDidMount() {
    getXContestInterface().animation.registerCallback(this.onAnimationFrame);
    getGPSProvider().registerCallback(this.onNewGPSDataReceived);
  }
  componentWillUnmount() {
    getXContestInterface().animation.unregisterCallback(this.onAnimationFrame);
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
      <Box height="100%" bgcolor="#eeeef5" overflow="auto">
        <Box margin={1}>
          {onlinePilots.map(pilotId => (
            <AnimatedPilotListEntry
              key={pilotId}
              pilotId={pilotId}
              pilotName={getPilotName(pilotId)}
              removePilot={this.removePilot}
            />
          ))}
        </Box>
        <Box margin={1}>
          {offlinePilots.map(pilotId => (
            <Box
              key={pilotId}
              onClick={() => {
                this.removePilot(pilotId);
              }}
              display="flex"
            >
              <Typography variant="body2">{getPilotName(pilotId)}</Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                style={{ paddingLeft: ".5em" }}
              >
                [{pilotId}]
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
}

export default AnimatedPilotList;
