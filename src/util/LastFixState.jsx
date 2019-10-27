import React, { Component } from "react";
import { getGPSProvider } from "../common/GPSProvider";
import { getDistance, getRhumbLineBearing } from "geolib";

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
  const timestamp = props.timestamp;
  const landed = props.landed;
  const relative = props.relative;

  if (timestamp == null) {
    return <span>never</span>;
  }
  let time_diff = Date.parse(timestamp) - Date.now();

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
          LIVE
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
    this.state = {};

    this.distanceRef = React.createRef();
    this.arrowRef = React.createRef();
  }

  onNewGPSDataReceived = gpsData => {
    this.gpsData = gpsData;

    // Otherwise, directly update through the refs
    this.updateThroughRef();
  };

  componentDidMount() {
    getGPSProvider().registerCallback(this.onNewGPSDataReceived);
  }
  componentWillUnmount() {
    getGPSProvider().unregisterCallback(this.onNewGPSDataReceived);
  }

  updateThroughRef = () => {
    if (this.arrowRef.current) {
      const arrowStyle = LastFixArrow.getArrowRotationStyle(
        this.gpsData,
        this.props.lastFix
      );
      Object.assign(this.arrowRef.current.style, arrowStyle);
    }
    if (this.distanceRef.current) {
      this.distanceRef.current.innerHTML = LastFixArrow.getDistance(
        this.gpsData,
        this.props.lastFix
      );
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
    const transform = "rotate(" + bearing.toString() + "deg)";

    const rotationStyle = {
      transform: transform,

      /* Safari */
      WebkitTransform: transform,

      /* Firefox */
      MozTransform: transform,

      /* IE */
      msTransform: transform,

      /* Opera */
      OTransform: transform
    };
    return rotationStyle;
  }

  render() {
    return (
      <span>
        <span ref={this.distanceRef}>
          {LastFixArrow.getDistance(this.gpsData, this.props.lastFix)}
        </span>{" "}
        <div
          ref={this.arrowRef}
          style={{
            display: "inline-block",
            ...LastFixArrow.getArrowRotationStyle(
              this.gpsData,
              this.props.lastFix
            )
          }}
        >
          ↑
        </div>
      </span>
    );
  }
}
