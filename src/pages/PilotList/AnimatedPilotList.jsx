import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import AnimatedPilotListEntry from "./AnimatedPilotListEntry";

class AnimatedPilotList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      onlinePilots: []
    };
    this.pilotData = null;
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

  componentDidMount() {
    getXContestInterface().animation.registerCallback(this.onNewDataReceived);
  }
  componentWillUnmount() {
    getXContestInterface().animation.unregisterCallback(this.onNewDataReceived);
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

    const content = pilots.map(pilotId => (
      <AnimatedPilotListEntry
        key={pilotId}
        pilotId={pilotId}
        removePilot={() => {
          this.props.removePilots([pilotId]);
        }}
      ></AnimatedPilotListEntry>
    ));

    return (
      <Box height="100%" style={{ overflowY: "auto" }}>
        {content}
      </Box>
    );
  }
}

export default AnimatedPilotList;
