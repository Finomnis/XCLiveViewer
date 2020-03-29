import { createFocusCameraIcon } from "./ButtonIcons";
import { getMapViewportControllerService } from "../../../services/MapViewportControllerService";

export function createFocusCameraMapButton(google, map) {
  // Create a div to hold the control.
  var controlDiv = document.createElement("div");

  // Set CSS for the control border
  var controlUI = document.createElement("div");
  controlUI.classList.add("custom-google-maps-button");
  controlUI.title = "Focus camera";
  controlUI.appendChild(createFocusCameraIcon());
  controlDiv.appendChild(controlUI);

  controlDiv.onclick = () => {
    getMapViewportControllerService().setFollowMode();
  };

  return controlDiv;
}
