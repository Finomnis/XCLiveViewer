import {
  getChosenPilots,
  setChosenPilots,
  defaultPilotEntry,
} from "./ChosenPilots";

function fixChosenPilots() {
  let chosenPilots = { ...getChosenPilots() };

  let changed = false;
  for (let pilotId of [...Object.keys(chosenPilots)]) {
    let chosenPilot = chosenPilots[pilotId];
    // if chosenPilot is not an object
    if (chosenPilot !== Object(chosenPilot)) {
      if (typeof chosenPilot == "string") {
        chosenPilots[pilotId] = defaultPilotEntry(chosenPilot);
        changed = true;
      } else {
        chosenPilots[pilotId] = defaultPilotEntry(pilotId);
        changed = true;
      }
    }
  }

  if (changed) {
    setChosenPilots(chosenPilots);
  }
}

export default function resolveBreakingChanges() {
  fixChosenPilots();
}
