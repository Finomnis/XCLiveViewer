import RunningDerivation from "../../util/RunningDerivation";
import { getDistance } from "geolib";
import findBisect from "../../util/FindBisect";

export const parseTime = (isoStr) => {
  return Math.round(Date.parse(isoStr) / 1000);
};

export default class FlightAnimationData {
  constructor() {
    this.data = [];
    this.counter_gpsVario = new RunningDerivation(0.7);
    this.counter_baroVarion = new RunningDerivation(0.7);
    this.counter_velocity = new RunningDerivation(
      0.7,
      (start, end) => getDistance(start, end, 0.01),
      () => false
    );
  }

  at = (index) => this.data[index];

  clear() {
    // reset everything
    this.data = [];
    this.counter_gpsVario = new RunningDerivation(0.7);
    this.counter_baroVarion = new RunningDerivation(0.7);
    this.counter_velocity = new RunningDerivation(
      0.7,
      (start, end) => getDistance(start, end, 0.01),
      () => false
    );
  }

  get length() {
    return this.data.length;
  }

  isAfterLastElement(timestamp) {
    if (this.data.length <= 0) return true;
    return this.data[this.data.length - 1].t < timestamp;
  }

  append(data) {
    for (const elem of data) {
      const timestamp = parseTime(elem.timestamp);
      const pos = { lat: elem.lat, lng: elem.lon };

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
        t: timestamp,
      };
      this.data.push(newElem);
    }
  }

  replace(data) {
    this.clear();
    this.append(data);
  }

  insert(data) {
    const newElements = [];
    for (const elem of data) {
      const timestamp = parseTime(elem.timestamp);
      const pos = { lat: elem.lat, lng: elem.lon };
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
        t: timestamp,
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
  }

  findBisect = (timestamp) => {
    return findBisect(timestamp, this.data.length, (pos) => this.data[pos].t);
  };

  findForwardSwipe = (timestamp, startPos) => {
    let pos = startPos;
    while (pos < this.data.length && this.data[pos].t < timestamp) {
      pos += 1;
    }
    return pos;
  };

  getNewestTimestamp = () => {
    if (this.data.length < 1) return null;
    return this.data[this.data.length - 1].t;
  };
}
