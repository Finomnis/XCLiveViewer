import React from "react";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";

export class ElevationHistogram extends React.PureComponent {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.maxValueRef = React.createRef();
    this.minValueRef = React.createRef();

    this.HEIGHT_MARGIN = 50;
    this.HEIGHT_STEPS = 100;
    this.COLOR_SKY = "#aac7ff";
    //this.COLOR_GROUND = "#f2b485";
    this.COLOR_GROUND = "#92b465";
    this.COLOR_PILOT = "#e11";

    this.lastRenderedTimestamp = 0;
  }

  prepareCanvasAndComputeLimits = (canvas, pilotData) => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // If landed, display the elevation histogram of the entire flight
    if (pilotData.landed && pilotData.track.length > 0) {
      const finalTimestamp = pilotData.lastPotentialAirTime;
      const beginningTimestamp = pilotData.track[0].timestamp;
      return Math.max(1, finalTimestamp - beginningTimestamp);
    }

    // Return number of minutes to be included in the histogram
    return 15 * 60;
  };

  renderCanvas = (
    canvas,
    track,
    minValue,
    maxValue,
    timeFrame,
    currentTime,
    currentElevation
  ) => {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width;
    const height = canvas.height;

    const getCoord = (time, elevation) => {
      const x = width * (1 - (currentTime - time) / timeFrame);
      const y = height * (1 - (elevation - minValue) / (maxValue - minValue));
      return [x, y];
    };

    const [, lastKnownElevationY] = getCoord(0, currentElevation);

    let ctx = canvas.getContext("2d", {
      alpha: false,
    });

    // paint ground
    ctx.fillStyle = this.COLOR_GROUND;
    ctx.fillRect(0, 0, width, height);

    // paint sky
    ctx.fillStyle = this.COLOR_SKY;
    ctx.strokeStyle = this.COLOR_PILOT;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, lastKnownElevationY);
    let currentY = lastKnownElevationY;
    for (let i = track.length - 1; i >= 0; i--) {
      const data = track[i];
      if (data.timestamp < currentTime - timeFrame) break;

      const [x, y] = getCoord(data.timestamp, data.elevation);
      ctx.lineTo(x, y);

      currentY = y;
    }
    ctx.lineTo(0, currentY);
    ctx.fill();

    // paint path
    ctx.lineWidth = 2 * dpr;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = track.length - 1; i >= 0; i--) {
      const data = track[i];
      if (data.timestamp < currentTime - timeFrame) break;

      const [x, y] = getCoord(data.timestamp, data.altitude);
      if (i === track.length - 1) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  shallowRerender = (data) => {
    if (!(this.props.pilot in data)) return;
    if (this.canvasRef.current === null) return;
    const canvas = this.canvasRef.current;

    // Perpare data
    const pilotData = data[this.props.pilot];
    const track = pilotData.track;
    const currentElevation = pilotData.elevation;
    const currentTime = pilotData.lastPotentialAirTime;

    // Only update once per second
    if (this.lastRenderedTimestamp === currentTime) return;
    this.lastRenderedTimestamp = currentTime;

    // Get current height, as a starting point
    const currentHeight =
      pilotData.gpsAlt !== null ? pilotData.gpsAlt : pilotData.baroAlt;
    if (currentHeight === null) return;

    // Prepare canvas and compute timeframe
    const timeFrame = this.prepareCanvasAndComputeLimits(canvas, pilotData);

    // Compute max/min value
    let minValue = currentElevation;
    let maxValue = currentHeight;
    for (let i = track.length - 1; i >= 0; i--) {
      const data = track[i];
      if (data.timestamp < currentTime - timeFrame) break;

      minValue = Math.min(minValue, data.elevation);
      maxValue = Math.max(maxValue, data.altitude);
    }
    maxValue += this.HEIGHT_MARGIN;
    minValue -= this.HEIGHT_MARGIN;
    maxValue = this.HEIGHT_STEPS * Math.ceil(maxValue / this.HEIGHT_STEPS);
    minValue = this.HEIGHT_STEPS * Math.floor(minValue / this.HEIGHT_STEPS);

    // Render canvas
    this.renderCanvas(
      canvas,
      track,
      minValue,
      maxValue,
      timeFrame,
      currentTime,
      currentElevation
    );

    // Update numbers
    if (this.maxValueRef.current !== null) {
      this.maxValueRef.current.textContent = maxValue.toString();
    }
    if (this.minValueRef.current !== null) {
      this.minValueRef.current.textContent = minValue.toString();
    }
  };

  onNewAnimationData = (data) => {
    this.shallowRerender(data);
  };

  componentDidMount = () => {
    this.shallowRerender(getXContestInterface().animation.getData());
    getXContestInterface().animation.registerCallback(this.onNewAnimationData);
  };
  componentDidUpdate = () => {
    this.shallowRerender(getXContestInterface().animation.getData());
  };
  componentWillUnmount() {
    getXContestInterface().animation.unregisterCallback(
      this.onNewAnimationData
    );
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            flex: "0 0 auto",
            width: "4em",
            paddingRight: ".2em",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            ref={this.maxValueRef}
            style={{ fontSize: ".8em", marginTop: "-.7em" }}
          />
          <div
            ref={this.minValueRef}
            style={{ fontSize: ".8em", marginBottom: "-.75em" }}
          />
        </div>
        <div
          style={{
            flex: "1 1 0",
            overflow: "hidden",
            position: "relative",
          }}
          ref={this.canvasParentRef}
        >
          <canvas
            ref={this.canvasRef}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          ></canvas>
        </div>
      </div>
    );
  }
}
