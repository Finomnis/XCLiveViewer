import { lerp } from "../../util/Interpolation";
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
  static fallbackData = flightInfos => {
    return {
      baroAlt: flightInfos.lastFix.baroAlt,
      gpsAlt: flightInfos.lastFix.gpsAlt,
      elevation: flightInfos.lastFix.elevation,
      pos: {
        lat: flightInfos.lastFix.lat,
        lng: flightInfos.lastFix.lon
      },
      gpsVario: null,
      baroVario: null,
      velocity: null
    };
  };

  static takeData(data) {
    return {
      baroAlt: data.baroAlt,
      gpsAlt: data.gpsAlt,
      elevation: data.elevation,
      pos: {
        lat: data.pos.lat,
        lng: data.pos.lng
      },
      gpsVario: data.gpsVario,
      baroVario: data.baroVario,
      velocity: data.velocity
    };
  }

  static blendData(data1, data2, pct) {
    return {
      baroAlt: lerp(data1.baroAlt, data2.baroAlt, pct),
      gpsAlt: lerp(data1.gpsAlt, data2.gpsAlt, pct),
      elevation: lerp(data1.elevation, data2.elevation, pct),
      pos: {
        lat: lerp(data1.pos.lat, data2.pos.lat, pct),
        lng: lerp(data1.pos.lng, data2.pos.lng, pct)
      },
      gpsVario: lerp(data1.gpsVario, data2.gpsVario, pct),
      baroVario: lerp(data1.baroVario, data2.baroVario, pct),
      velocity: lerp(data1.velocity, data2.velocity, pct)
    };
  }

  static blendDataSpline(data0, data1, data2, data3, pct) {
    // TODO add catmull-rom spline interpolation
    return null;
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
      limitTracks: getSetting(Settings.LIMIT_PATHS).getValue()
    };
    this.liveDataCache.reset();
    this.flightInfoDataCache.reset();
  };

  updateInfos = infos => {
    this.landed |= infos.landed;
    this.flightInfos = infos;
    this.flightInfoData.replace(infos.track);
    this.flightInfoDataCache.reset();
  };

  updateData = data => {
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
    if (cache.currentArrayPos <= 0) {
      // If the timestamp is before our track, return first element
      blendedData = DataGens.takeData(data.at(0));
      startOfTrack = true;
    } else if (cache.currentArrayPos >= data.length) {
      // If the timestamp is after our track, return last element
      blendedData = DataGens.takeData(data.at(data.length - 1));
      endOfTrack = true;
    } else {
      // If it is in between, return interpolated value
      const data0 = data.at(cache.currentArrayPos - 1);
      const data1 = data.at(cache.currentArrayPos);
      const blend = (timeStamp - data0.t) / (data1.t - data0.t);
      blendedData = DataGens.blendData(data0, data1, blend);
    }

    const newestDataTimestamp = data.at(data.length - 1).t;

    return [blendedData, startOfTrack, endOfTrack, newestDataTimestamp];
  };

  getFallbackData = () => {
    return [
      DataGens.fallbackData(this.flightInfos),
      false,
      this.flightInfos.landed,
      parseTime(this.flightInfos.lastFix.timestamp)
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
        elevation: elem.gpsAlt
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

  updateAnimation = animationTimeMillis => {
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
      newestDataTimestamp
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

    const result = {
      ...blendedData,
      startOfTrack: startOfTrack,
      endOfTrack: endOfTrack,
      landed: this.landed,
      newestDataTimestamp: newestDataTimestamp,
      track: track
    };

    return result;
  };
}

export default FlightAnimation;
