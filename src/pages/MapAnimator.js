import { getXContestInterface } from "../location_provider/XContest/XContestInterface";

export default class MapAnimator {
  constructor(map, google) {
    this.map = map;
    this.google = google;
    this.markers = {};
  }

  cleanupOldMarkers = data => {
    const toRemove = [];
    for (const pilot in this.markers) {
      if (!(pilot in data)) {
        toRemove.push(pilot);
      }
    }
    for (const pilot of toRemove) {
      this.markers[pilot].setMap(null);
      delete this.markers[pilot];
    }
  };

  update = data => {
    const pilotsInfos = getXContestInterface().getPilotInfos();
    this.cleanupOldMarkers(pilotsInfos);
    for (const pilot in pilotsInfos) {
      const info = pilotsInfos[pilot];

      // Retreive knowledge
      const pos = { lat: info.lastFix.lat, lng: info.lastFix.lon };
      let trackWaitingToStart = false;
      let trackEnded = true;
      let landed = info.landed;

      // Replace knowledge with better (live) knowledge if available
      if (
        pilot in data &&
        !(data[pilot] === null || data[pilot].pos.lat === null)
      ) {
        const pilotData = data[pilot];

        pos.lat = pilotData.pos.lat;
        pos.lng = pilotData.pos.lng;

        trackWaitingToStart = pilotData.startOfTrack;
        trackEnded = pilotData.endOfTrack;
      }

      // Add marker if it doesn't exist
      if (!(pilot in this.markers)) {
        this.markers[pilot] = new this.google.maps.Marker({
          map: this.map,
          position: pos,
          title: info.info.user.fullname
        });
      }

      // Update all marker properties
      const marker = this.markers[pilot];
      marker.setPosition(pos);
    }
    //console.log(data);
  };
}
