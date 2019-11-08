import { registerPersistentState } from "./PersistentState";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";

const persistentChosenPilots = registerPersistentState("chosen-pilots", {});

export const getChosenPilotsObject = () => persistentChosenPilots;

export function getChosenPilots() {
  return persistentChosenPilots.getValue();
}

export function setChosenPilots(newValue) {
  console.log("Selected pilots updated: ", newValue);
  return persistentChosenPilots.setValue(newValue);
}

// Sets new chosen pilots and also looks up their names.
// When used without argument, just updates the names of the existing pilots.
export function setChosenPilotsAndUpdateNames(chosenPilots = null) {
  if (chosenPilots === null) chosenPilots = { ...getChosenPilots() };

  const pilotList = getXContestInterface().getPilotInfos();
  let chosenPilotsUpdated = false;
  for (const pilotId in chosenPilots) {
    if (pilotId in pilotList) {
      // Get new name
      const currentName = pilotList[pilotId].info.user.fullname;
      // Get stored name
      const previousName = chosenPilots[pilotId];

      // If new name is different, update
      if (currentName !== previousName) {
        chosenPilots[pilotId] = currentName;
        chosenPilotsUpdated = true;
      }
    }
  }

  // If anything updated, set new list. This will trigger events.
  if (chosenPilotsUpdated) {
    setChosenPilots(chosenPilots);
  }
}

// Add new pilots
export const addPilots = pilotIds => {
  const newPilotState = { ...getChosenPilots() };

  let changed = false;
  for (const pilotId of pilotIds) {
    if (!(pilotId in newPilotState)) {
      newPilotState[pilotId] = null;
      changed = true;
    }
  }

  if (changed) {
    setChosenPilotsAndUpdateNames(newPilotState);
  }
};

// Remove pilots
export const removePilots = pilotIds => {
  const newPilotState = { ...getChosenPilots() };

  let changed = false;
  for (const pilotId of pilotIds) {
    if (pilotId in newPilotState) {
      delete newPilotState[pilotId];
      changed = true;
    }
  }

  if (changed) {
    setChosenPilots(newPilotState);
  }
};

export function useChosenPilots() {
  const [chosenPilots] = persistentChosenPilots.use();

  return [chosenPilots, addPilots, removePilots];
}
