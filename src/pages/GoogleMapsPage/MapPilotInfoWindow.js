export default class MapPilotInfoWindow {
  constructor(google) {
    this.google = google;
    this.infoWindow = new google.maps.InfoWindow({ content: "- ERROR -" });
    this.data = {};
    this.currentPilot = null;
  }

  open = (map, anchor, pilotId) => {
    this.currentPilot = pilotId;
    this.infoWindow.open(map, anchor);
    this.updateContent();
  };

  update = data => {
    this.data = data;
    this.updateContent();
  };

  updateContent = () => {
    // Some sanity checks
    if (this.infoWindow.anchor == null) {
      this.currentPilot = null;
      return;
    }

    if (this.currentPilot === null) return;

    if (!(this.currentPilot in this.data)) {
      this.currentPilot = null;
      this.infoWindow.close();
    }

    const pilotInfo = this.data[this.currentPilot];

    const height =
      pilotInfo.gpsAlt === null ? pilotInfo.baroAlt : pilotInfo.gpsAlt;
    const heightGnd = Math.max(height - pilotInfo.elevation, 0);

    // Update content
    let newContent = "";
    newContent += "<b>" + pilotInfo.name + "</b><br>";
    newContent += Math.round(height) + "m (";
    newContent += Math.round(heightGnd) + "m)<br>";

    if (pilotInfo.baroVario !== null && !pilotInfo.landed) {
      const vario = Math.round(pilotInfo.baroVario * 10);
      let varioAbs = Math.abs(vario);
      if (varioAbs > 99) varioAbs = 99;
      const varioStr =
        (vario >= 0 ? "&plus;" : "&minus;") +
        Math.floor(varioAbs / 10) +
        "." +
        (varioAbs % 10) +
        "m/s";
      newContent += "<span>" + varioStr + "</span>&nbsp;&nbsp;";
    }

    if (pilotInfo.velocity !== null) {
      newContent += Math.round(pilotInfo.velocity * 3.6) + "km/h";
    }

    if (this.infoWindow.getContent() !== newContent) {
      this.infoWindow.setContent(newContent);
    }
  };
}
