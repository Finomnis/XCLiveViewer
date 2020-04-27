import React from "react";
import { Box, Typography, Toolbar } from "@material-ui/core";

import { withStyles } from "@material-ui/styles";
import { Button, DialogActions } from "@material-ui/core";

import SubWindow from "../../util/SubWindow";

import VisibilitySelectorList from "./VisibilitySelectorList";

const FullHeightSubWindow = withStyles({
  paper: {
    height: "100%",
  },
})(SubWindow);

// Base window, without the table
class VisibilitySelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      shown: [],
      open: false,
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    // Whenever the window is opened, set the selected pilots from
    // the shown pilots
    if (props.open !== state.open) {
      if (props.open === false) return { open: props.open };

      let selected = Object.entries(props.pilots)
        .filter(([, pilotData]) => pilotData.shown)
        .map(([pilotId]) => pilotId);

      return { open: props.open, selected, shown: selected };
    }

    return null;
  };

  pilotClicked = (name) => {
    const selected = [...this.state.selected];
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  closeWindow = () => {
    this.props.onClose();
  };

  selectAll = () => {
    let selected = Object.entries(this.props.pilots).map(
      ([pilotId]) => pilotId
    );
    this.setState({ selected });
  };

  render() {
    const fullScreen = false;

    return (
      <FullHeightSubWindow
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
        <Box
          flex="1 1 auto"
          marginY="8px"
          display="flex"
          flexDirection="column"
          alignItems="stretch"
        >
          <VisibilitySelectorList
            pilots={this.props.pilots}
            selected={this.state.selected}
            onPilotClicked={this.pilotClicked}
          />
        </Box>
        <DialogActions>
          <Button onClick={this.selectAll} color="primary">
            Reset
          </Button>
          <Button onClick={this.closeWindow} color="primary">
            Cancel
          </Button>
          <Button
            disabled={false}
            onClick={() => {
              this.props.onUpdateVisibility(this.state.selected);
              this.closeWindow();
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </FullHeightSubWindow>
    );
  }
}

export default VisibilitySelector;
