import RunningDerivation from "../../util/RunningDerivation";
import { getDistance } from "geolib";

class FlightAnimation {
  constructor() {
    this.data = [];
    this.counter_gpsVario = new RunningDerivation(0.7);
    this.counter_baroVarion = new RunningDerivation(0.7);
    this.counter_velocity = new RunningDerivation(
      0.7,
      (start, end) => getDistance(start, end, 0.01),
      () => false
    );

    // Animation
    this.animationArrayPos = null;
    this.mapsPath = [];
  }

  updateData = data => {
    const parseTime = isoStr => {
      return Math.round(Date.parse(isoStr) / 1000);
    };

    if (data.length < 1) return;

    // Compute start time
    const data_start_time = parseTime(data[0].timestamp);
    if (
      this.data.length === 0 ||
      this.data[this.data.length - 1].t < data_start_time
    ) {
      // If start time is after our own data, simply append
      for (const elem of data) {
        const timestamp = parseTime(elem.timestamp);
        const pos = { lat: elem.lat, lon: elem.lon };

        // Compute new running average values
        const gpsVario = this.counter_gpsVario.update(elem.gpsAlt, timestamp);
        const baroVario = this.counter_baroVarion.update(
          elem.baroAlt,
          timestamp
        );
        const velocity = this.counter_velocity.update(pos, timestamp);

        const newElem = {
          baroAlt: elem.baroAlt,
          gpsAlt: elem.gpsAlt,
          elevation: elem.elevation,
          pos: pos,
          gpsVario: gpsVario,
          baroVario: baroVario,
          velocity: velocity,
          t: timestamp
        };
        this.data.push(newElem);
      }
    }
    // TODO add else back in. Out for now, to ensure both paths are working as intended
    /*else*/ {
      // Otherwise, merge

      // Compute new elements
      const newElements = [];
      for (const elem of data) {
        const timestamp = parseTime(elem.timestamp);
        const pos = { lat: elem.lat, lon: elem.lon };
        const newElem = {
          baroAlt: elem.baroAlt,
          gpsAlt: elem.gpsAlt,
          elevation: elem.elevation,
          pos: pos,
          gpsVario: null,
          baroVario: null,
          velocity: null,
          t: timestamp
        };
        newElements.push(newElem);
      }

      // Merge
      const oldElements = this.data;
      this.data = [];

      let oldPos = 0;
      let newPos = 0;

      while (true) {
        if (oldPos >= oldElements.length && newPos >= newElements.length) break;
        else if (oldPos >= oldElements.length) {
          this.data.push(newElements[newPos]);
          newPos += 1;
        } else if (newPos >= newElements.length) {
          this.data.push(oldElements[oldPos]);
          oldPos += 1;
        } else {
          const oldEl = oldElements[oldPos];
          const newEl = newElements[newPos];

          if (newEl.t < oldEl.t) {
            this.data.push(newEl);
            newPos += 1;
          } else if (oldEl.t < newEl.t) {
            this.data.push(oldEl);
            oldPos += 1;
          } else {
            this.data.push(newEl);
            oldPos += 1;
            newPos += 1;
          }
        }
      }

      // Re-compute derivatives
      this.counter_gpsVario.reset();
      this.counter_baroVarion.reset();
      this.counter_velocity.reset();
      for (let elem of this.data) {
        const gpsVario = this.counter_gpsVario.update(elem.gpsAlt, elem.t);
        const baroVario = this.counter_baroVarion.update(elem.baroAlt, elem.t);
        const velocity = this.counter_velocity.update(elem.pos, elem.t);

        elem.gpsVario = gpsVario;
        elem.baroVario = baroVario;
        elem.velocity = velocity;
      }

      // Reset animation
      this.reset_animation();
    }

    console.log("Animation updated.", this.data);
  };

  resetAnimation = () => {
    this.animationArrayPos = null;
    this.mapsPath = [];
  };

  updateAnimation = currentTime => {
    console.log("updateAnimation " + currentTime);
  };
}

export default FlightAnimation;
