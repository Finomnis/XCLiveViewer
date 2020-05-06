import React from "react";

import { Typography, Toolbar, Divider } from "@material-ui/core";

import { Button, DialogActions } from "@material-ui/core";

import SubWindow from "../../util/SubWindow";

import { getChosenPilots } from "../../common/PersistentState/ChosenPilots";
import LinkPopup from "./LinkPopup";
import { encodeBase64Json } from "../../util/Base64Data";
import PilotMultipleChoiceList from "../common/PilotMultipleChoiceList";

// Base window, without the table
class LinkCreator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: {},
      createdLink: null,
      open: props.open,
    };
  }

  pilotClicked = (name) => {
    const selected = { ...this.state.selected };

    if (name in selected) {
      delete selected[name];
    } else {
      selected[name] = true;
    }

    this.setState({ selected });
  };

  closeWindow = () => {
    this.props.onClose();
  };

  static getDerivedStateFromProps = (props, state) => {
    // Whenever the window is opened, set the selected pilots from
    // the shown pilots
    if (props.open !== state.open) {
      if (props.open === false) {
        return { open: props.open };
      } else {
        return { open: props.open, selected: {} };
      }
    }

    return null;
  };

  createLink = (pilots) => {
    const payload = {};

    const chosenPilots = getChosenPilots();

    pilots.forEach((pilotId) => {
      if (pilotId in chosenPilots && chosenPilots[pilotId].name != null) {
        payload[pilotId] = chosenPilots[pilotId].name;
      } else {
        payload[pilotId] = null;
      }
    });

    const encodedData = encodeBase64Json(payload);

    const url = window.location.href + "?group=" + encodedData;

    this.setState({ createdLink: url });
  };

  render() {
    const fullScreen = false;

    return (
      <React.Fragment>
        <SubWindow
          open={this.props.open}
          onClose={this.closeWindow}
          fullScreen={fullScreen}
          maxWidth="xs"
          fullWidth={true}
        >
          <Toolbar>
            <Typography component="div" variant="h6" id="tableTitle">
              Choose Pilots to share:
            </Typography>
          </Toolbar>
          <Divider />
          <PilotMultipleChoiceList
            pilots={getChosenPilots()}
            selected={this.state.selected}
            onPilotClicked={this.pilotClicked}
          />
          <DialogActions>
            <Button onClick={this.closeWindow} color="primary">
              Cancel
            </Button>
            <Button
              disabled={false}
              onClick={() => {
                this.closeWindow();
                this.createLink(Object.keys(this.state.selected));
              }}
              color="primary"
            >
              Create Link
            </Button>
          </DialogActions>
        </SubWindow>
        <LinkPopup
          link={this.state.createdLink}
          onClose={() => {
            this.setState({ createdLink: null });
          }}
        />
      </React.Fragment>
    );
  }
}

export default LinkCreator;
