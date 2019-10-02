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
    const pilotsInfo = getXContestInterface().getPilotInfos();
    this.cleanupOldMarkers(data);
    for (const pilot in data) {
      if (!(pilot in pilotsInfo)) continue;
      const pilotInfo = pilotsInfo[pilot];

      const pilotData = data[pilot];
      if (pilotData === null || pilotData.pos.lat === null) continue;

      if (!(pilot in this.markers)) {
        this.markers[pilot] = new this.google.maps.Marker({
          map: this.map,
          position: pilotData.pos,
          title: pilotInfo.info.user.fullname
        });
        console.log("Marker:", pilotData.pos);
      }

      const marker = this.markers[pilot];
      marker.setPosition(pilotData.pos);
    }
    //console.log(data);
  };
}
