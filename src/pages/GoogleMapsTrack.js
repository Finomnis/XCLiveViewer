export default class GoogleMapsTrack {
  constructor(google, map, pilotInfo, initialData) {
    this.google = google;
    this.marker = new this.google.maps.Marker({
      map: map,
      position: initialData.pos,
      title: pilotInfo.info.user.fullname
    });
  }

  setMap = map => {
    this.marker.setMap(map);
  };

  updateData = data => {
    this.marker.setPosition(data.pos);
  };
}
