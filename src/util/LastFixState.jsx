import React from "react";

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

const LastFixState = props => {
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

export const LastFixArrow = props => {
  const rotationStyle = {
    transform: "rotate(-90deg)",

    /* Safari */
    WebkitTransform: "rotate(-90deg)",

    /* Firefox */
    MozTransform: "rotate(-90deg)",

    /* IE */
    msTransform: "rotate(-90deg)",

    /* Opera */
    OTransform: "rotate(-90deg)"
  };
  return (
    <span>
      1.7km <div style={{ display: "inline-block", ...rotationStyle }}>↑</div>
    </span>
  );
};

export default LastFixState;
