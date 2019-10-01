class HighPrecisionTimeSync {
  constructor(tolerance = 20) {
    this.offset = 0.0;
    this.tolerance = tolerance;
  }

  get = (currentHighPrecisionTime, currentTime) => {
    let estimatedTime = currentHighPrecisionTime + this.offset;
    const offBy = estimatedTime - currentTime;
    if (offBy > this.tolerance) {
      this.offset -= offBy - this.tolerance;
      estimatedTime = currentHighPrecisionTime + this.offset;
      console.log("adjusted:", offBy - this.tolerance);
    } else if (offBy < -this.tolerance) {
      this.offset -= offBy + this.tolerance;
      estimatedTime = currentHighPrecisionTime + this.offset;
      console.log("adjusted:", offBy + this.tolerance);
    }
    return estimatedTime;
  };
}

export default HighPrecisionTimeSync;
