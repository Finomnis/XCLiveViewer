import React from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import PilotSelector from "../PilotSelector/PilotSelector";
import {
  getChosenPilots,
  addPilots,
  removePilots,
  getChosenPilotsObject
} from "../../common/PersistentState/ChosenPilots";
import AnimatedPilotList from "./AnimatedPilotList";

class Pilots extends React.Component {
  constructor(props) {
    super(props);

    this.state = { pilotSelectorOpen: false, chosenPilots: getChosenPilots() };
  }

  openPilotSelector = () => {
    if (this.state.pilotSelectorOpen === false)
      this.setState(state => ({ ...state, pilotSelectorOpen: true }));
  };

  closePilotSelector = () => {
    if (this.state.pilotSelectorOpen === true)
      this.setState(state => ({ ...state, pilotSelectorOpen: false }));
  };

  chosenPilotsChanged = newChosenPilots => {
    this.setState(state => ({
      ...state,
      chosenPilots: newChosenPilots
    }));
  };

  componentDidMount() {
    getChosenPilotsObject().registerCallback(this.chosenPilotsChanged);
  }
  componentWillUnmount() {
    getChosenPilotsObject().unregisterCallback(this.chosenPilotsChanged);
  }

  render() {
    return (
      <React.Fragment>
        <AnimatedPilotList
          pilots={this.state.chosenPilots}
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
          alreadyAdded={Object.keys(this.state.chosenPilots)}
        />
      </React.Fragment>
    );
  }
}

export default Pilots;
