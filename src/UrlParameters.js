import { decodeBase64, decodeBase64Json } from "./util/Base64Data";
import {
  getChosenPilots,
  defaultPilotEntry,
  setChosenPilots,
} from "./common/PersistentState/ChosenPilots";

export function processUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("group")) {
    groupParameterJson(urlParams.get("group"));
  }

  if (urlParams.has("g")) {
    groupParameter(urlParams.get("g"));
  }

  // If there were params,
  if (window.location.href !== window.location.href.split("?")[0]) {
    const newHref = window.location.href.split("?")[0];
    window.history.replaceState({}, "", newHref);
  }
}

function groupParameterJson(groupData) {
  let groupPilots = decodeBase64Json(groupData);
  processGroupData(groupPilots);
}

function groupParameter(groupData) {
  let groupPilots = decodeBase64(groupData);
  processGroupData(groupPilots);
}

function processGroupData(groupPilots) {
  let chosenPilots = { ...getChosenPilots() };

  // Create pilots and update names
  Object.entries(groupPilots).forEach(([pilotId, pilotName]) => {
    if (pilotId in chosenPilots) {
      if (pilotName != null)
        chosenPilots[pilotId] = { ...chosenPilots[pilotId], name: pilotName };
    } else {
      if (pilotName != null) {
        chosenPilots[pilotId] = defaultPilotEntry(pilotName);
      } else {
        chosenPilots[pilotId] = defaultPilotEntry(pilotId);
      }
    }
  });

  // Set visibility
  Object.keys(chosenPilots).forEach((pilotId) => {
    chosenPilots[pilotId] = {
      ...chosenPilots[pilotId],
      shown: pilotId in groupPilots,
    };
  });

  setChosenPilots(chosenPilots);
}
