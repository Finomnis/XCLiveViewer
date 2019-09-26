import React from "react";
import { useState } from "react";
import { Fab } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import PilotSelector from "./PilotSelector";

const Pilots = () => {
  const theme = useTheme();
  const [pilotSelectorOpen, setPilotSelectorOpen] = useState(false);

  const [pilots, addPilots, removePilots] = useChosenPilots();

  // TODO sort pilots

  const content = Object.entries(pilots).map(([pilotId, pilotName]) => {
    let displayedName = pilotName;
    if (pilotName === null) {
      displayedName = pilotId;
    }
    return <Box key={pilotId}>{displayedName}</Box>;
  });

  return (
    <React.Fragment>
      <Box height="100%" style={{ overflowY: "auto" }}>
        {content}
      </Box>

      <Box
        position="absolute"
        bottom={theme.spacing(2)}
        right={theme.spacing(2)}
      >
        <Fab
          size="small"
          color="primary"
          onClick={() => setPilotSelectorOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Box>
      <PilotSelector
        open={pilotSelectorOpen}
        onClose={() => setPilotSelectorOpen(false)}
        onAddPilots={addPilots}
        alreadyAdded={Object.keys(pilots)}
      />
    </React.Fragment>
  );
};

export default Pilots;

function useChosenPilots() {
  //TODO replace with persistant storage
  const [chosenPilots, setChosenPilots] = useState({});

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
