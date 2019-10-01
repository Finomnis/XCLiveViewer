import { registerPersistentState } from "./PersistentState";

const persistentChosenPilots = registerPersistentState("chosen-pilots", {});

export const getChosenPilotsObject = () => persistentChosenPilots;

export function getChosenPilots() {
  return persistentChosenPilots.getValue();
}

export function useChosenPilots() {
  const [chosenPilots, setChosenPilots] = persistentChosenPilots.use();

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
