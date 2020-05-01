import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import GoogleMapsTrack from "./GoogleMapsTrack";
import MapPilotInfoWindow from "./MapPilotInfoWindow";

export default class MapAnimator {
  constructor(map, google, canReceiveMouseClicks) {
    this.map = map;
    this.google = google;
    this.tracks = {};
    this.infoWindow = new MapPilotInfoWindow(google);
    this.currentMouseOvers = {};
    this.canReceiveMouseClicks = canReceiveMouseClicks;
  }

  cleanupOldTracks = (data) => {
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

  onMouseOver = (pilotId, isOver, pagePos) => {
    if (isOver) {
      if (!(pilotId in this.currentMouseOvers))
        this.currentMouseOvers[pilotId] = { num: 0, pos: { left: 0, top: 0 } };
      this.currentMouseOvers[pilotId].num += 1;
      if (pagePos != null) {
        this.currentMouseOvers[pilotId].pos = pagePos;
      }
    } else {
      if (pilotId in this.currentMouseOvers) {
        this.currentMouseOvers[pilotId].num -= 1;
        if (this.currentMouseOvers[pilotId].num <= 0) {
          delete this.currentMouseOvers[pilotId];
        }
      }
    }
  };

  update = ({ pilotData_filtered }) => {
    const pilotInfos = getXContestInterface().getPilotInfos();

    // Remove tracks that we unsubscribed from
    this.cleanupOldTracks(pilotData_filtered);

    // Update all pilots
    Object.entries(pilotData_filtered).forEach(([pilot, pilotData]) => {
      if (!(pilot in pilotInfos)) return;
      const info = pilotInfos[pilot];

      // Add track if it doesn't exist
      if (!(pilot in this.tracks)) {
        this.tracks[pilot] = new GoogleMapsTrack(
          this.google,
          this.map,
          info,
          pilotData,
          this.infoWindow,
          (isOver, pagePos) => this.onMouseOver(pilot, isOver, pagePos),
          this.canReceiveMouseClicks
        );
      }

      // Update all tracks properties
      const track = this.tracks[pilot];
      track.updateData(pilotData);
    });

    this.infoWindow.update(pilotData_filtered);
  };
}
