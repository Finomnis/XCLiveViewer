import {
  getPilotIcon,
  getPilotIconColor,
  getPilotTrackColor,
  pilotIconChanged
} from "../../common/PilotIcon";

export default class GoogleMapsTrack {
  constructor(google, map, pilotInfo, initialData) {
    this.google = google;
    this.pilotColor = getPilotIconColor(pilotInfo.info.user.username);
    this.trackColor = getPilotTrackColor(pilotInfo.info.user.username);

    this.pilotIcon = getPilotIcon(
      initialData.startOfTrack,
      initialData.endOfTrack,
      initialData.landed,
      initialData.pos,
      initialData.velocityVec,
      this.pilotColor
    );

    this.marker = new this.google.maps.Marker({
      map: map,
      position: initialData.pos,
      title: pilotInfo.info.user.fullname,
      icon: this.pilotIcon
    });
    this.track = new this.google.maps.Polyline({
      map: map,
      path: [],
      strokeColor: this.trackColor
    });
    this.currentTrackVersion = { startTime: null, endTime: null, length: null };
    this.newestTrackSegment = new this.google.maps.Polyline({
      map: map,
      path: [],
      strokeColor: this.trackColor
    });
  }

  setMap = map => {
    this.marker.setMap(map);
    this.track.setMap(map);
    this.newestTrackSegment.setMap(map);
  };

  _updateTrack = track => {
    if (!track || track.length < 1) return;

    // Compute identifiers to reduce the amount if maps updates
    const length = track.length;
    const startTime = track[0].timestamp;
    const endTime = track[length - 1].timestamp;
    if (
      startTime === this.currentTrackVersion.startTime &&
      endTime === this.currentTrackVersion.endTime &&
      length === this.currentTrackVersion.length
    ) {
      return;
    }

    // If the start/end time or length changed, update track in map
    this.currentTrackVersion.startTime = startTime;
    this.currentTrackVersion.endTime = endTime;
    this.currentTrackVersion.length = length;

    this.track.setPath(track);
  };

  updateData = data => {
    this.marker.setPosition(data.pos);

    // Update Pilot Icon if necessary
    let pilotIcon = this.marker.getIcon();
    const newPilotIcon = getPilotIcon(
      data.startOfTrack,
      data.endOfTrack,
      data.landed,
      data.pos,
      data.velocityVec,
      this.pilotColor
    );
    if (pilotIconChanged(pilotIcon, newPilotIcon))
      this.marker.setIcon(newPilotIcon);

    if (data.track.length > 0) {
      this.newestTrackSegment.setPath([
        data.track[data.track.length - 1],
        data.pos
      ]);
    }
    this._updateTrack(data.track);
  };
}
