import createPersistedState from "use-persisted-state";

const persistentChosenPilots = createPersistedState("chosen-pilots");

export function useChosenPilots() {
  //TODO replace with persistant storage
  const [chosenPilots, setChosenPilots] = persistentChosenPilots({});

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
