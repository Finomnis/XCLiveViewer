import { decodeBase64 } from "./util/Base64Data";
import {
  getChosenPilots,
  defaultPilotEntry,
} from "./common/PersistentState/ChosenPilots";

export function processUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("group")) {
    processGroup(urlParams.get("group"));
  }

  // If there were params,
  if (window.location.href !== window.location.href.split("?")[0]) {
    window.location.href = window.location.href.split("?")[0];
  }
}

function processGroup(groupData) {
  let groupPilots = decodeBase64(groupData);

  let chosenPilots = { ...getChosenPilots() };

  // Create pilots and update names
  Object.entries(groupPilots).forEach(([pilotId, pilotName]) => {
    if (pilotId in chosenPilots) {
      chosenPilots[pilotId].name = pilotName;
    } else {
      chosenPilots[pilotId] = defaultPilotEntry(pilotName);
    }
  });

  // Set visibility
  Object.entries(chosenPilots).forEach(([pilotId, pilotData]) => {
    pilotData.shown = pilotId in groupPilots;
  });
}
