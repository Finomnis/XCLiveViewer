import { decodeBase64 } from "./util/Base64Data";
import {
  getChosenPilots,
  defaultPilotEntry,
  setChosenPilots,
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
