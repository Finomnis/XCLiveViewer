import {
  getPilotIcon,
  getPilotIconColor,
  getPilotTrackColor,
  pilotIconChanged
} from "../../common/PilotIcon";

export default class GoogleMapsTrack {
  constructor(google, map, pilotInfo, initialData, pilotInfoWindow) {
    this.google = google;
    this.pilotInfoWindow = pilotInfoWindow;
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

    this.marker.addListener("click", () => {
      this.pilotInfoWindow.open(
        this.map,
        this.marker,
        pilotInfo.info.user.username
      );
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
    this.newestTrackSegmentData = null;
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

    if (
      startTime === this.currentTrackVersion.startTime &&
      length > this.currentTrackVersion.length &&
      endTime > this.currentTrackVersion.endTime
    ) {
      let oldTrack = this.track.getPath();
      let oldLength = oldTrack.getLength();
      while (oldLength < length) {
        const newPoint = track[oldLength];
        oldLength = oldTrack.push(
          new this.google.maps.LatLng(newPoint.lat, newPoint.lng)
        );
      }

      this.currentTrackVersion.endTime = endTime;
      this.currentTrackVersion.length = length;
      return;
    }

    //console.log("Full path update!");

    // If the start/end time or length changed, update track in map
    this.currentTrackVersion.startTime = startTime;
    this.currentTrackVersion.endTime = endTime;
    this.currentTrackVersion.length = length;

    this.track.setPath(track);
  };

  _updateNewestSegment = (trackEndPos, currentPos) => {
    // Initialize if unset
    if (this.newestTrackSegmentData === null) {
      this.newestTrackSegment.setPath([trackEndPos, currentPos]);
      this.newestTrackSegmentData = [trackEndPos, currentPos];
      //console.log("Set newest track segment new");
    }

    // Query previous and update previous
    const [previousTrackEndPos, previousPos] = this.newestTrackSegmentData;
    this.newestTrackSegmentData = [trackEndPos, currentPos];

    // Get maps polyline
    const path = this.newestTrackSegment.getPath();

    // Update first piont if necessary
    if (
      trackEndPos.lat !== previousTrackEndPos.lat ||
      trackEndPos.lng !== previousTrackEndPos.lng
    ) {
      const point = new this.google.maps.LatLng(
        trackEndPos.lat,
        trackEndPos.lng
      );
      path.setAt(0, point);
      //console.log("Set trackEndPos");
    }

    if (
      previousPos.lat !== currentPos.lat ||
      previousPos.lng !== currentPos.lng
    ) {
      const point = new this.google.maps.LatLng(currentPos.lat, currentPos.lng);
      path.setAt(1, point);
      //console.log("Set currentPos");
    }
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
      const currentPos = data.track[data.track.length - 1];
      const trackEndPos = data.pos;
      this._updateNewestSegment(trackEndPos, currentPos);
    }
    this._updateTrack(data.track);
  };
}
