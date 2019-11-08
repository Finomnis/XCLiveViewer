import React from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import PilotSelector from "../PilotSelector/PilotSelector";
import {
  getChosenPilots,
  addPilots,
  removePilots
} from "../../common/PersistentState/ChosenPilots";
import AnimatedPilotList from "./AnimatedPilotList";

class Pilots extends React.PureComponent {
  state = { pilotSelectorOpen: false };

  openPilotSelector = () => {
    if (this.state.pilotSelectorOpen === false)
      this.setState({ pilotSelectorOpen: true });
  };

  closePilotSelector = () => {
    if (this.state.pilotSelectorOpen === true)
      this.setState({ pilotSelectorOpen: false });
  };

  render() {
    const pilots = getChosenPilots();

    return (
      <React.Fragment>
        <AnimatedPilotList
          pilots={pilots}
          removePilots={removePilots}
        ></AnimatedPilotList>

        <Box position="absolute" bottom="16px" right="16px">
          <Fab size="small" color="primary" onClick={this.openPilotSelector}>
            <AddIcon />
          </Fab>
        </Box>
        <PilotSelector
          open={this.state.pilotSelectorOpen}
          onClose={this.closePilotSelector}
          onAddPilots={addPilots}
          alreadyAdded={Object.keys(pilots)}
        />
      </React.Fragment>
    );
  }
}

export default Pilots;
