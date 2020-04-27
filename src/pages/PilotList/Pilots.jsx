import React from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import StarRateIcon from "@material-ui/icons/StarRate";
import Box from "@material-ui/core/Box";
import PilotSelector from "../PilotSelector/PilotSelector";
import {
  getChosenPilots,
  addPilots,
  removePilots,
  getChosenPilotsObject,
  updateShownPilots,
} from "../../common/PersistentState/ChosenPilots";
import AnimatedPilotList from "./AnimatedPilotList";
import VisibilitySelector from "../VisibilitySelector/VisibilitySelector";

class Pilots extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pilotSelectorOpen: false,
      visibilitySelectorOpen: false,
      chosenPilots: getChosenPilots(),
    };
  }

  openPilotSelector = () => {
    if (this.state.pilotSelectorOpen === false)
      this.setState({ pilotSelectorOpen: true });
  };

  closePilotSelector = () => {
    if (this.state.pilotSelectorOpen === true)
      this.setState({ pilotSelectorOpen: false });
  };

  openVisibilitySelector = () => {
    if (this.state.visibilitySelectorOpen === false)
      this.setState({ visibilitySelectorOpen: true });
  };

  closeVisibilitySelector = () => {
    if (this.state.visibilitySelectorOpen === true)
      this.setState({ visibilitySelectorOpen: false });
  };

  chosenPilotsChanged = (newChosenPilots) => {
    this.setState({
      chosenPilots: newChosenPilots,
    });
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

        <Box position="absolute" bottom="68px" right="16px">
          <Fab
            size="small"
            color="primary"
            onClick={this.openVisibilitySelector}
          >
            <StarRateIcon />
          </Fab>
        </Box>
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
        <VisibilitySelector
          open={this.state.visibilitySelectorOpen}
          onClose={this.closeVisibilitySelector}
          onUpdateVisibility={(selected) => {
            updateShownPilots(selected);
          }}
          pilots={this.state.chosenPilots}
        />
      </React.Fragment>
    );
  }
}

export default Pilots;
