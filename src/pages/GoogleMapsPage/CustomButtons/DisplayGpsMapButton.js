import { createGpsActiveIcon, createGpsDisabledIcon } from "./ButtonIcons";
import { getSetting, Settings } from "../../../common/PersistentState/Settings";

export function createDisplayGpsMapButton(google, map) {
  // Create a div to hold the control.
  var controlDiv = document.createElement("div");
  controlDiv.onclick = () => {
    const gpsShownSetting = getSetting(Settings.GPS_SHOWN);
    gpsShownSetting.setValue(!gpsShownSetting.getValue());
  };

  updateGpsMapButton(controlDiv, getSetting(Settings.GPS_SHOWN).getValue());

  return controlDiv;
}

export function updateGpsMapButton(controlDiv, gpsShown) {
  let controlUI = controlDiv.firstChild;
  if (controlUI === null) {
    // Set CSS for the control border
    controlUI = document.createElement("div");
    controlUI.classList.add("custom-google-maps-button");
    controlUI.title = "Toggle GPS";
    controlUI.appendChild(createGpsActiveIcon());
    controlUI.appendChild(createGpsDisabledIcon());
    controlDiv.appendChild(controlUI);
  }

  if (gpsShown) {
    controlUI.childNodes[0].style.display = null;
    controlUI.childNodes[1].style.display = "none";
  } else {
    controlUI.childNodes[0].style.display = "none";
    controlUI.childNodes[1].style.display = null;
  }
}
