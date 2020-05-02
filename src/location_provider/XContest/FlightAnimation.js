import { lerp, splineDerivative, spline } from "../../util/Interpolation";
import FlightAnimationData, { parseTime } from "./FlightAnimationData";
import { getSetting, Settings } from "../../common/PersistentState/Settings";

class FlightAnimationDataCache {
  // IMPORTANT ASSUMPTION IN THIS ENTIRE FILE:
  // While the cache exists, new data gets only appended. Whenever existing data changes, the cache
  // will be invalidated.
  // I.E., chache invariants:
  //    - existing data entries don't change, indices always point to the same data
  //    - data timestamps are monotonic rising, meaning, to get newer data the data array only
  //      needs to be traversed in forward direction, never backwards.
  // This enables efficient caching and O(1) lookup times.
  constructor() {
    this.currentArrayPos = null;
    this.mapsPath = [];
    this.mapsPathNewestPos = 0;
  }

  reset = () => {
    this.currentArrayPos = null;
    this.mapsPath = [];
    this.mapsPathNewestPos = 0;
  };
}

class DataGens {
  static fallbackData = (flightInfos) => {
    return {
      baroAlt: flightInfos.lastFix.baroAlt,
      gpsAlt: flightInfos.lastFix.gpsAlt,
      elevation: flightInfos.lastFix.elevation,
      pos: {
        lat: flightInfos.lastFix.lat,
        lng: flightInfos.lastFix.lon,
      },
      gpsVario: null,
      baroVario: null,
      velocity: null,
    };
  };

  static takeData(data) {
    return {
      baroAlt: data.baroAlt,
      gpsAlt: data.gpsAlt,
      elevation: data.elevation,
      pos: {
        lat: data.pos.lat,
        lng: data.pos.lng,
      },
      gpsVario: data.gpsVario,
      baroVario: data.baroVario,
      velocity: data.velocity,
    };
  }

  static blendData(data1, data2, timeStamp) {
    const pct = (timeStamp - data1.t) / (data2.t - data1.t);
    return {
      baroAlt: lerp(data1.baroAlt, data2.baroAlt, pct),
      gpsAlt: lerp(data1.gpsAlt, data2.gpsAlt, pct),
      elevation: lerp(data1.elevation, data2.elevation, pct),
      pos: {
        lat: lerp(data1.pos.lat, data2.pos.lat, pct),
        lng: lerp(data1.pos.lng, data2.pos.lng, pct),
      },
      gpsVario: lerp(data1.gpsVario, data2.gpsVario, pct),
      baroVario: lerp(data1.baroVario, data2.baroVario, pct),
      velocity: lerp(data1.velocity, data2.velocity, pct),
    };
  }

  static blendDataSpline(data0, data1, data2, data3, timeStamp) {
    const pct = (timeStamp - data1.t) / (data2.t - data1.t);
    return {
      baroAlt: lerp(data1.baroAlt, data2.baroAlt, pct),
      gpsAlt: lerp(data1.gpsAlt, data2.gpsAlt, pct),
      elevation: lerp(data1.elevation, data2.elevation, pct),
      pos: {
        lat: spline(
          data0.pos.lat,
          data0.t,
          data1.pos.lat,
          data1.t,
          data2.pos.lat,
          data2.t,
          data3.pos.lat,
          data3.t,
          timeStamp
        ),
        lng: spline(
          data0.pos.lng,
          data0.t,
          data1.pos.lng,
          data1.t,
          data2.pos.lng,
          data2.t,
          data3.pos.lng,
          data3.t,
          timeStamp
        ),
      },
      gpsVario: lerp(data1.gpsVario, data2.gpsVario, pct),
      baroVario: lerp(data1.baroVario, data2.baroVario, pct),
      velocity: lerp(data1.velocity, data2.velocity, pct),
    };
  }

  static computeLinearVelocity(data1, data2) {
    const t1 = data1.t;
    const t2 = data2.t;
    if (t1 === t2) return null;

    const dT = t2 - t1;

    const p1 = data1.pos;
    const p2 = data2.pos;

    const vLat = (p2.lat - p1.lat) / dT;
    const vLng = (p2.lng - p1.lng) / dT;
    return { lat: vLat, lng: vLng };
  }

  static computeSplineVelocity(d0, d1, d2, d3, t) {
    const t0 = d0.t;
    const t1 = d1.t;
    const t2 = d2.t;
    const t3 = d3.t;

    const p0 = d0.pos;
    const p1 = d1.pos;
    const p2 = d2.pos;
    const p3 = d3.pos;

    const vLat = splineDerivative(
      p0.lat,
      t0,
      p1.lat,
      t1,
      p2.lat,
      t2,
      p3.lat,
      t3,
      t
    );

    const vLng = splineDerivative(
      p0.lng,
      t0,
      p1.lng,
      t1,
      p2.lng,
      t2,
      p3.lng,
      t3,
      t
    );

    return { lat: vLat, lng: vLng };
  }
}

class FlightAnimation {
  constructor(flightInfos) {
    // Live data
    this.liveData = new FlightAnimationData();
    this.liveDataCache = new FlightAnimationDataCache();

    // Data from flight infos, used as fallback
    this.flightInfos = null;
    this.flightInfoData = new FlightAnimationData();
    this.flightInfoDataCache = new FlightAnimationDataCache();

    // 'landed' state
    this.landed = flightInfos.landed;

    // Set flight infos
    this.updateInfos(flightInfos);

    this.settings = {};
    this.updateSettings();

    // register settings hooks
    getSetting(Settings.ANIMATION_DELAY).registerCallback(this.updateSettings);
    getSetting(Settings.LOW_LATENCY).registerCallback(this.updateSettings);
    getSetting(Settings.PATH_LENGTH).registerCallback(this.updateSettings);
    getSetting(Settings.LIMIT_PATHS).registerCallback(this.updateSettings);
  }

  destroy = () => {
    getSetting(Settings.ANIMATION_DELAY).unregisterCallback(
      this.updateSettings
    );
    getSetting(Settings.LOW_LATENCY).unregisterCallback(this.updateSettings);
    getSetting(Settings.PATH_LENGTH).unregisterCallback(this.updateSettings);
    getSetting(Settings.LIMIT_PATHS).unregisterCallback(this.updateSettings);
  };

  updateSettings = () => {
    this.settings = {
      timeOffsetSeconds: getSetting(Settings.ANIMATION_DELAY).getValue(),
      lowLatencyMode: getSetting(Settings.LOW_LATENCY).getValue(),
      trackLengthMinutes: getSetting(Settings.PATH_LENGTH).getValue(),
      limitTracks: getSetting(Settings.LIMIT_PATHS).getValue(),
    };
    this.liveDataCache.reset();
    this.flightInfoDataCache.reset();
  };

  updateInfos = (infos) => {
    this.landed |= infos.landed;
    this.flightInfos = infos;
    this.flightInfoData.replace(infos.track);
    this.flightInfoDataCache.reset();
  };

  updateData = (data) => {
    if (data.length < 1) return;

    // Compute start time
    const data_start_time = parseTime(data[0].timestamp);
    if (this.liveData.isAfterLastElement(data_start_time)) {
      // If the new data is newer than everything in the existing data, append
      this.liveData.append(data);
    } else {
      // Otherwise, merge
      this.liveData.insert(data);

      // Reset animation
      this.liveDataCache.reset();
    }
  };

  updateLanded = () => {
    console.log("Received flight landed message!");
    this.landed = true;
  };

  getInterpolatedData = (data, cache, timeStamp) => {
    if (data.length < 1) return null;

    if (cache.currentArrayPos === null) {
      cache.currentArrayPos = data.findBisect(timeStamp);
    } else {
      // Optimization because we assume that time runs forward and the next value is after the current value
      cache.currentArrayPos = data.findForwardSwipe(
        timeStamp,
        cache.currentArrayPos
      );
    }

    // Compute
    let blendedData = null;
    let endOfTrack = false;
    let startOfTrack = false;
    let velocityVec = null;
    if (cache.currentArrayPos <= 0) {
      // If the timestamp is before our track, return first element
      blendedData = DataGens.takeData(data.at(0));
      if (data.length >= 2) {
        velocityVec = DataGens.computeLinearVelocity(data.at(0), data.at(1));
      }
      startOfTrack = true;
    } else if (cache.currentArrayPos >= data.length) {
      // If the timestamp is after our track, return last element
      blendedData = DataGens.takeData(data.at(data.length - 1));
      if (data.length >= 2) {
        velocityVec = DataGens.computeLinearVelocity(
          data.at(data.length - 2),
          data.at(data.length - 1)
        );
      }
      endOfTrack = true;
    } else {
      const data1 = data.at(cache.currentArrayPos - 1);
      const data2 = data.at(cache.currentArrayPos);

      const data0 =
        cache.currentArrayPos - 2 >= 0
          ? data.at(cache.currentArrayPos - 2)
          : {
              ...data1,
              t: data1.t - 1,
            };

      const data3 =
        cache.currentArrayPos + 1 < data.length
          ? data.at(cache.currentArrayPos + 1)
          : {
              ...data2,
              t: data2.t + 1,
            };

      // Blend via spline
      blendedData = DataGens.blendDataSpline(
        data0,
        data1,
        data2,
        data3,
        timeStamp
      );
      velocityVec = DataGens.computeSplineVelocity(
        data0,
        data1,
        data2,
        data3,
        timeStamp
      );
    }

    const newestDataTimestamp = data.at(data.length - 1).t;

    return [
      blendedData,
      startOfTrack,
      endOfTrack,
      newestDataTimestamp,
      velocityVec,
    ];
  };

  getFallbackData = () => {
    return [
      DataGens.fallbackData(this.flightInfos),
      false,
      true,
      parseTime(this.flightInfos.lastFix.timestamp),
      null,
    ];
  };

  computeTrack = (data, cache, timestamp) => {
    if (data.length < 1) return null;

    const oldestTimestamp = timestamp - this.settings.trackLengthMinutes * 60;

    let track = cache.mapsPath;

    // Append new data
    while (
      cache.mapsPathNewestPos < data.length &&
      data.at(cache.mapsPathNewestPos).t < timestamp
    ) {
      const elem = data.at(cache.mapsPathNewestPos);
      track.push({
        lat: elem.pos.lat,
        lng: elem.pos.lng,
        timestamp: elem.t,
        altitude: elem.gpsAlt !== null ? elem.gpsAlt : elem.baroAlt,
        elevation: elem.elevation,
      });
      cache.mapsPathNewestPos += 1;
    }

    // Delete old data
    if (this.settings.limitTracks) {
      const removeChunkSize = 32;
      let numRemove = 0;
      while (
        numRemove + removeChunkSize - 1 < track.length &&
        track[numRemove + removeChunkSize - 1].timestamp < oldestTimestamp
      ) {
        numRemove += removeChunkSize;
      }
      if (numRemove > 0) {
        track = track.slice(numRemove);
        cache.mapsPath = track;
      }
    }

    return track;
  };

  updateAnimation = (animationTimeMillis) => {
    const animationTimeSeconds = this.settings.lowLatencyMode
      ? animationTimeMillis / 1000
      : animationTimeMillis / 1000 - this.settings.timeOffsetSeconds;

    let animationResult = this.getInterpolatedData(
      this.liveData,
      this.liveDataCache,
      animationTimeSeconds
    );
    if (!animationResult) {
      animationResult = this.getInterpolatedData(
        this.flightInfoData,
        this.flightInfoDataCache,
        animationTimeSeconds
      );
    }
    if (!animationResult) {
      animationResult = this.getFallbackData();
    }

    let track = this.computeTrack(
      this.liveData,
      this.liveDataCache,
      animationTimeSeconds
    );
    if (!track) {
      track = this.computeTrack(
        this.flightInfoData,
        this.flightInfoDataCache,
        animationTimeSeconds
      );
    }
    if (!track) {
      track = [];
    }

    let [
      blendedData,
      startOfTrack,
      endOfTrack,
      newestDataTimestamp,
      velocityVec,
    ] = animationResult;

    // Special case for endOfTrack for lowLatencyMode
    if (this.settings.lowLatencyMode) {
      if (this.landed) {
        // If 'landed' got signalled, immediately also end the track,
        // as the 'landed' signal comes simultaneously to the last track message
        endOfTrack = true;
      } else {
        // Otherwise, determine by how long ago we last heard from the pilot whether
        // the track is broken or not.
        // Has to be treated different than the default case, because in lowLatencyMode we
        // are always at the end of the track.
        endOfTrack = newestDataTimestamp < animationTimeSeconds - 80;
      }
    }

    // Compute last potential air time.
    // Used for computation of flight duration.
    let lastPotentialAirtime = animationTimeSeconds;
    if (endOfTrack && this.landed) {
      lastPotentialAirtime = newestDataTimestamp;
    }

    const result = {
      ...blendedData,
      startOfTrack: startOfTrack,
      endOfTrack: endOfTrack,
      landed: this.landed, // Only valid if 'endOfTrack' is also true!
      name: this.flightInfos.info.user.fullname,
      newestDataTimestamp: newestDataTimestamp,
      track: track,
      velocityVec: velocityVec,
      lastPotentialAirTime: Math.round(lastPotentialAirtime),
    };

    return result;
  };

  getNewestTimestamp = () => this.liveData.getNewestTimestamp();
}

export default FlightAnimation;
