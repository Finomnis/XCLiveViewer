import React from "react";
import { useState } from "react";
import { Fab } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import PilotSelector from "../PilotSelector";
import { useChosenPilots } from "../../common/PersistentState/ChosenPilots";
import AnimatedPilotList from "./AnimatedPilotList";

const Pilots = () => {
  const theme = useTheme();
  const [pilotSelectorOpen, setPilotSelectorOpen] = useState(false);

  const [pilots, addPilots, removePilots] = useChosenPilots();

  // TODO sort pilots

  return (
    <React.Fragment>
      <AnimatedPilotList
        pilots={pilots}
        removePilots={removePilots}
      ></AnimatedPilotList>

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
