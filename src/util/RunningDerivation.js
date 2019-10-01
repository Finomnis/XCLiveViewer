export default class RunningDerivation {
  constructor(
    smoothingFactor,
    derivation_func = (a, b) => b - a,
    invalid_func = a => a === 0
  ) {
    this.computeDiff = derivation_func;
    this.isInvalid = invalid_func;
    this.old_val = null;
    this.old_t = null;
    this.running_avg = null;
    this.smoothingFactor = smoothingFactor;
  }

  update(new_val, new_t) {
    if (
      this.old_val === null ||
      new_val === null ||
      this.old_t === null ||
      new_t === null ||
      this.isInvalid(this.old_val) ||
      this.isInvalid(new_val) ||
      this.old_t === this.new_t
    ) {
      this.old_val = new_val;
      this.old_t = new_t;
      return null;
    }

    let dt = (new_t - this.old_t) / 1000.0;
    let diff = this.computeDiff(this.old_val, new_val);
    let deriv = diff / dt;

    let weight = Math.pow(smoothingFactor, dt);
    if (this.running_avg === null) {
      this.running_avg = deriv;
    } else {
      this.running_avg = weight * this.running_avg + (1.0 - weight) * deriv;
    }

    this.old_val = new_val;
    this.old_t = new_t;
    return this.running_avg;
  }
}
