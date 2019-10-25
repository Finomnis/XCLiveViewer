import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import { getGPSProvider } from "../../common/GPSProvider";

class AnimatedPilotListEntry extends Component {
  constructor(props) {
    super(props);
    this.pilotInfo = null;
    this.gpsData = null;
    this.state = {
      online: false
    };
  }

  onNewGPSDataReceived = gpsData => {
    this.gpsData = gpsData;

    // TODO replace with a more efficient way
    this.forceUpdate();
  };

  onNewDataReceived = pilotData => {
    if (!(this.props.pilotId in pilotData)) {
      this.pilotInfo = null;
      if (this.state.online) this.setState({ ...this.state, online: false });
      return;
    }

    this.pilotInfo = pilotData[this.props.pilotId];
    if (!this.state.online) this.setState({ ...this.state, online: true });

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

  render() {
    const animatedPilotData = this.pilotInfo;
    let pilotDebugOutput = [];

    for (const key in animatedPilotData) {
      const dataElement = animatedPilotData[key];
      if (isNaN(dataElement)) {
        if (dataElement.length > 5) continue;
        for (const subKey in dataElement) {
          pilotDebugOutput.push(
            <tr key={key + subKey}>
              <td>{key + "." + subKey}</td>
              <td>{dataElement[subKey].toString()}</td>
            </tr>
          );
        }
      } else {
        pilotDebugOutput.push(
          <tr key={key}>
            <td>{key}</td>
            <td>
              {(Math.round(100 * animatedPilotData[key]) / 100).toString()}
            </td>
          </tr>
        );
      }
    }

    return (
      <Box margin="10px" onClick={this.props.removePilot}>
        {this.props.pilotId}
        <Box>
          GPS:{" "}
          {this.gpsData === null
            ? "NULL"
            : this.gpsData.coords.accuracy.toString()}
        </Box>
        <Box>
          GPS time:{" "}
          {this.gpsData === null
            ? "NULL"
            : Math.round(this.gpsData.timestamp / 1000).toString()}
        </Box>
        <table>
          <tbody>{pilotDebugOutput}</tbody>
        </table>
      </Box>
    );
  }
}

export default AnimatedPilotListEntry;
