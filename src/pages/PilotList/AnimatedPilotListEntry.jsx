import React, { Component } from "react";
import { Box } from "@material-ui/core";
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
