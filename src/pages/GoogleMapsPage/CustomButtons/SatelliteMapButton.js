import { createSatelliteIcon } from "./ButtonIcons";

export function createSatelliteMapButton(google, map) {
  // Create a div to hold the control.
  var controlDiv = document.createElement("div");

  // Set CSS for the control border
  var controlUI = document.createElement("div");
  controlUI.classList.add("custom-google-maps-button");
  controlUI.title = "Toggle satellite view";
  controlUI.appendChild(createSatelliteIcon());
  controlDiv.appendChild(controlUI);

  controlDiv.onclick = () => {
    if (map.getMapTypeId() === google.maps.MapTypeId.HYBRID) {
      map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    } else {
      map.setMapTypeId(google.maps.MapTypeId.HYBRID);
    }
  };

  return controlDiv;
}
