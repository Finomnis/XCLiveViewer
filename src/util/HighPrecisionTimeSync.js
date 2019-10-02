class HighPrecisionTimeSync {
  // Tolerance should be larger than the duration of one animation frame.
  // Most animations are 60Hz, meaning 16ms, so 20ms is fine.
  constructor(tolerance = 20) {
    this.offset = 0.0;
    this.tolerance = tolerance;
  }

  get = (currentHighPrecisionTime, currentTime) => {
    let estimatedTime = currentHighPrecisionTime + this.offset;
    const offBy = estimatedTime - currentTime;

    if (offBy > this.tolerance || offBy < -this.tolerance) {
      this.offset -= offBy;
      estimatedTime = currentHighPrecisionTime + this.offset;
    }

    return estimatedTime;
  };
}

export default HighPrecisionTimeSync;
