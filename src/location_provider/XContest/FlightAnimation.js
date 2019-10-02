import RunningDerivation from "../../util/RunningDerivation";
import { getDistance } from "geolib";
import findBisect from "../../util/FindBisect";
import { lerp } from "../../util/Interpolation";

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

        const baroAlt = elem.baroAlt === 0 ? null : elem.baroAlt;
        const gpsAlt = elem.gpsAlt === 0 ? null : elem.gpsAlt;

        // Compute new running average values
        const gpsVario = this.counter_gpsVario.update(gpsAlt, timestamp);
        const baroVario = this.counter_baroVarion.update(baroAlt, timestamp);
        const velocity = this.counter_velocity.update(pos, timestamp);

        const newElem = {
          baroAlt: baroAlt,
          gpsAlt: gpsAlt,
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
    else {
      // Otherwise, merge

      // Compute new elements
      const newElements = [];
      for (const elem of data) {
        const timestamp = parseTime(elem.timestamp);
        const pos = { lat: elem.lat, lon: elem.lon };
        const baroAlt = elem.baroAlt === 0 ? null : elem.baroAlt;
        const gpsAlt = elem.gpsAlt === 0 ? null : elem.gpsAlt;

        const newElem = {
          baroAlt: baroAlt,
          gpsAlt: gpsAlt,
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
      this.resetAnimation();
    }

    console.log("Animation updated.", this.data);
  };

  resetAnimation = () => {
    this.animationArrayPos = null;
    this.mapsPath = [];
  };

  blendData = (data1, data2, pct) => {
    const result = {
      baroAlt: null,
      gpsAlt: null,
      elevation: null,
      pos: {
        lat: null,
        lon: null
      },
      gpsVario: null,
      baroVario: null,
      velocity: null
    };

    if (data1 !== null) {
      if (data2 === null) {
        result.baroAlt = data1.baroAlt;
        result.gpsAlt = data1.gpsAlt;
        result.elevation = data1.elevation;
        result.pos.lat = data1.pos.lat;
        result.pos.lon = data1.pos.lon;
        result.gpsVario = data1.gpsVario;
        result.baroVario = data1.baroVario;
        result.velocity = data1.velocity;
      } else {
        //TODO optionally replace with catmull-rom interpolation
        result.baroAlt = lerp(data1.baroAlt, data2.baroAlt, pct);
        result.gpsAlt = lerp(data1.gpsAlt, data2.gpsAlt, pct);
        result.elevation = lerp(data1.elevation, data2.elevation, pct);
        result.pos.lat = lerp(data1.pos.lat, data2.pos.lat, pct);
        result.pos.lon = lerp(data1.pos.lon, data2.pos.lon, pct);
        result.gpsVario = lerp(data1.gpsVario, data2.gpsVario, pct);
        result.baroVario = lerp(data1.baroVario, data2.baroVario, pct);
        result.velocity = lerp(data1.velocity, data2.velocity, pct);
      }
    }
    return result;
  };

  updateAnimation = (animationTimeMillis, lowLatencyMode) => {
    const animationTimeSeconds = animationTimeMillis / 1000;

    // Compute current array position
    if (this.animationArrayPos === null) {
      this.animationArrayPos = findBisect(
        animationTimeSeconds,
        this.data.length,
        pos => this.data[pos].t
      );
    } else {
      while (
        this.animationArrayPos < this.data.length &&
        this.data[this.animationArrayPos].t < animationTimeSeconds
      ) {
        this.animationArrayPos += 1;
      }
    }

    let data0 = null;
    let data1 = null;
    let blend = 0;
    if (this.data.length > 0) {
      if (this.animationArrayPos <= 0) {
        data0 = this.data[0];
      } else if (this.animationArrayPos >= this.data.length) {
        data0 = this.data[this.data.length - 1];
      } else {
        data0 = this.data[this.animationArrayPos - 1];
        data1 = this.data[this.animationArrayPos];
        blend = (animationTimeSeconds - data0.t) / (data1.t - data0.t);
      }
    }
    const blendedData = this.blendData(data0, data1, blend);

    const result = {
      ...blendedData,
      currentPos: this.animationArrayPos,
      blend: blend
    };

    return result;
  };
}

export default FlightAnimation;
