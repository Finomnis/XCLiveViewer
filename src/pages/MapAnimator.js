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
    const pilotInfos = getXContestInterface().getPilotInfos();

    // Remove markers that we unsubscribed from
    this.cleanupOldMarkers(data);

    Object.entries(data).forEach(([pilot, pilotData]) => {
      if (!(pilot in pilotInfos)) return;
      const info = pilotInfos[pilot];

      const pos = { lat: pilotData.pos.lat, lng: pilotData.pos.lng };

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
    });
    //console.log(data);
  };
}
