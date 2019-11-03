import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import GoogleMapsTrack from "./GoogleMapsTrack";

export default class MapAnimator {
  constructor(map, google) {
    this.map = map;
    this.google = google;
    this.tracks = {};
  }

  cleanupOldTracks = data => {
    const toRemove = [];
    for (const pilot in this.tracks) {
      if (!(pilot in data)) {
        toRemove.push(pilot);
      }
    }
    for (const pilot of toRemove) {
      this.tracks[pilot].setMap(null);
      delete this.tracks[pilot];
    }
  };

  update = data => {
    const pilotInfos = getXContestInterface().getPilotInfos();

    // Remove tracks that we unsubscribed from
    this.cleanupOldTracks(data);

    // Update all pilots
    Object.entries(data).forEach(([pilot, pilotData]) => {
      if (!(pilot in pilotInfos)) return;
      const info = pilotInfos[pilot];

      // Add track if it doesn't exist
      if (!(pilot in this.tracks)) {
        this.tracks[pilot] = new GoogleMapsTrack(
          this.google,
          this.map,
          info,
          pilotData
        );
      }

      // Update all tracks properties
      const track = this.tracks[pilot];
      track.updateData(pilotData);
    });
  };
}
