import React from "react";
import { Typography, Toolbar, Divider } from "@material-ui/core";

import { Button, DialogActions } from "@material-ui/core";

import SubWindow from "../../util/SubWindow";

import VisibilitySelectorList from "./VisibilitySelectorList";

// Base window, without the table
class VisibilitySelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: {},
      open: false,
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    // Whenever the window is opened, set the selected pilots from
    // the shown pilots
    if (props.open !== state.open) {
      if (props.open === false) return { open: props.open };

      let selected = {};
      Object.entries(props.pilots).forEach(([pilotId, pilotData]) => {
        if (pilotData.shown) {
          selected[pilotId] = true;
        }
      });

      return { open: props.open, selected };
    }

    return null;
  };

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

  reset = () => {
    let selected = {};
    Object.keys(this.props.pilots).forEach((pilotId) => {
      selected[pilotId] = true;
    });
    this.setState({ selected });
  };

  render() {
    const fullScreen = false;

    return (
      <SubWindow
        open={this.props.open}
        onClose={this.closeWindow}
        fullScreen={fullScreen}
        maxWidth="xs"
        fullWidth={true}
      >
        <Toolbar>
          <Typography component="div" variant="h6" id="tableTitle">
            Select shown pilots:
          </Typography>
        </Toolbar>
        <Divider />
        <VisibilitySelectorList
          pilots={this.props.pilots}
          selected={this.state.selected}
          onPilotClicked={this.pilotClicked}
        />
        <DialogActions>
          <Button onClick={this.reset} color="primary">
            Reset
          </Button>
          <Button onClick={this.closeWindow} color="primary">
            Cancel
          </Button>
          <Button
            disabled={false}
            onClick={() => {
              this.props.onUpdateVisibility(Object.keys(this.state.selected));
              this.closeWindow();
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </SubWindow>
    );
  }
}

export default VisibilitySelector;
