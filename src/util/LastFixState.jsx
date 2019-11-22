import React, { Component } from "react";
import { getGPSProvider } from "../common/GPSProvider";
import { getDistance, getRhumbLineBearing } from "geolib";
import { getRotationStyle } from "./Rotation";

function formatTimeDiff(millis) {
  let negative = "";

  if (millis < 0) {
    millis = -millis;
    negative = "-";
  }

  let secs = Math.floor(millis / 1000);
  if (secs < 60) {
    return negative + secs + " sec";
  }

  let mins = Math.floor(secs / 60);
  if (mins < 60) {
    return negative + mins + " min";
  }

  let hours = Math.floor(mins / 60);
  mins = mins - hours * 60;
  if (hours < 24) {
    return negative + hours + ":" + mins.toString().padStart(2, "0") + " h";
  }

  let days = Math.floor(hours / 24);
  hours = hours - days * 24;
  return (
    negative +
    days +
    "d " +
    hours +
    ":" +
    mins.toString().padStart(2, "0") +
    " h"
  );
}

function timestampToTimeString(timestamp) {
  let time = new Date(timestamp);
  return time.toLocaleTimeString();
}

export const LastFixState = props => {
  const { timestamp, landed, relative, showLastFix } = props;

  if (timestamp == null) {
    return <span>never</span>;
  }
  let time_diff = new Date(timestamp).getTime() - Date.now();

  let timeStr = "";
  if (relative) timeStr = formatTimeDiff(time_diff);
  else timeStr = timestampToTimeString(timestamp);

  if (landed) {
    return <span style={{ color: "#346B8F" }}>&#10004; {timeStr}</span>;
  }

  if (-time_diff < 120000) {
    if (relative)
      return (
        <span style={{ color: "green" }}>
          <span role="img" aria-hidden>
            &#9899;
          </span>{" "}
          {showLastFix ? timeStr : "LIVE"}
        </span>
      );
    else
      return (
        <span style={{ color: "green" }}>
          <span role="img" aria-hidden>
            &#9899;
          </span>{" "}
          {timeStr}
        </span>
      );
  }

  if (relative) return <span style={{ color: "red" }}>! LIVE ({timeStr})</span>;
  else return <span style={{ color: "red" }}>! {timeStr}</span>;
};

export class LastFixArrow extends Component {
  constructor(props) {
    super(props);
    this.gpsData = getGPSProvider().getData();

    this.distanceRef = React.createRef();
    this.arrowRef = React.createRef();
    this.lastFix = this.props.lastFix;
  }

  onNewGPSDataReceived = gpsData => {
    this.gpsData = gpsData;

    // Directly update through the refs
    this.updateThroughRef();
  };

  componentDidMount() {
    getGPSProvider().registerCallback(this.onNewGPSDataReceived);
  }
  componentWillUnmount() {
    getGPSProvider().unregisterCallback(this.onNewGPSDataReceived);
  }

  setFix = newFix => {
    this.lastFix = newFix;

    // Directly update through the refs
    this.updateThroughRef();
  };

  updateThroughRef = () => {
    if (this.arrowRef.current) {
      const arrowStyle = LastFixArrow.getArrowRotationStyle(
        this.gpsData,
        this.lastFix
      );
      Object.assign(this.arrowRef.current.style, arrowStyle);
    }
    if (this.distanceRef.current) {
      const newDistance = LastFixArrow.getDistance(this.gpsData, this.lastFix);
      if (newDistance !== this.distanceRef.current.innerHTML)
        this.distanceRef.current.innerHTML = newDistance;
    }
  };

  static getDistance(myPosition, pilotFix) {
    if (myPosition === null || pilotFix === null) return "--km";

    const distance = getDistance(
      { lat: myPosition.coords.latitude, lng: myPosition.coords.longitude },
      pilotFix
    );
    return (Math.round(distance / 100) / 10).toString() + "km";
  }

  static getArrowRotationStyle(myPosition, pilotFix) {
    if (myPosition === null || pilotFix === null) return {};
    const bearing = getRhumbLineBearing(
      { lat: myPosition.coords.latitude, lng: myPosition.coords.longitude },
      pilotFix
    );
    return getRotationStyle(bearing);
  }

  render() {
    this.lastFix = this.props.lastFix;
    return (
      <React.Fragment>
        <span ref={this.distanceRef}>
          {LastFixArrow.getDistance(this.gpsData, this.lastFix)}
        </span>{" "}
        <div
          ref={this.arrowRef}
          style={{
            display: "inline-block",
            ...LastFixArrow.getArrowRotationStyle(this.gpsData, this.lastFix)
          }}
        >
          ↑
        </div>
      </React.Fragment>
    );
  }
}
