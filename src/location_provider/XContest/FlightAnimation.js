import { lerp } from "../../util/Interpolation";
import FlightAnimationData, { parseTime } from "./FlightAnimationData";

class FlightAnimationDataCache {
  constructor() {
    this.currentArrayPos = null;
    this.mapsPath = [];
  }

  reset = () => {
    this.currentArrayPos = null;
    this.mapsPath = [];
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
  }

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

    return [blendedData, startOfTrack, endOfTrack];
  };

  getFallbackData = () => {
    return [
      DataGens.fallbackData(this.flightInfos),
      false,
      this.flightInfos.landed
    ];
  };

  updateAnimation = (animationTimeMillis, lowLatencyMode) => {
    const animationTimeSeconds = animationTimeMillis / 1000;

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

    const [blendedData, startOfTrack, endOfTrack] = animationResult;

    const result = {
      ...blendedData,
      startOfTrack: startOfTrack,
      endOfTrack: endOfTrack,
      landed: this.landed
    };

    return result;
  };
}

export default FlightAnimation;
