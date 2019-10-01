import { registerPersistentState } from "./PersistentState";
import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";

const persistentChosenPilots = registerPersistentState("chosen-pilots", {});

export function getChosenPilots() {
  return persistentChosenPilots.getValue();
}

export function useChosenPilots() {
  const [
    chosenPilots,
    setChosenPilotsPersistent
  ] = persistentChosenPilots.use();

  const setChosenPilots = pilots => {
    // TODO move to callback
    // Explicitely tell XContestInterface, as it is not a Component and cannot use hooks
    getXContestInterface().setSubscribedPilots(pilots);
    setChosenPilotsPersistent(pilots);
  };

  // Add new pilots
  const addPilots = pilotIds => {
    const newPilotState = { ...chosenPilots };

    let changed = false;
    for (const pilotId of pilotIds) {
      if (!(pilotId in newPilotState)) {
        newPilotState[pilotId] = null;
        changed = true;
      }
    }

    if (changed) {
      setChosenPilots(newPilotState);
    }
  };

  // Remove pilots
  const removePilots = pilotIds => {
    const newPilotState = { ...chosenPilots };

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

  return [chosenPilots, addPilots, removePilots];
}
