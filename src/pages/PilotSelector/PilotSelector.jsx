import React from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Toolbar
} from "@material-ui/core";
import { useState } from "react";

import { lighten, makeStyles } from "@material-ui/core/styles";
import { Button, DialogActions, TextField } from "@material-ui/core";

import SubWindow from "../../util/SubWindow";
import PilotSelectorList from "./PilotSelectorList";
import { pure } from "recompose";

const useStyles = makeStyles({
  fullHeightWindow: {
    height: "100%"
  }
});

// Base window, without the table
const PilotSelector = props => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  // State
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const numSelected = selected.length;

  const closeWindow = () => {
    // Reset state
    setSearch("");
    setSelected([]);
    props.onClose();
  };

  const pilotClicked = name => {
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

    setSelected(newSelected);
  };

  return (
    <SubWindow
      open={props.open}
      onClose={closeWindow}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth={true}
      classes={{ paper: classes.fullHeightWindow }}
    >
      <Toolbar
        style={
          numSelected === 0
            ? {}
            : theme.palette.type === "light"
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
              }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
              }
        }
      >
        {numSelected > 0 ? (
          <Typography component="div" color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography component="div" variant="h6" id="tableTitle">
            Add new pilots:
          </Typography>
        )}
      </Toolbar>
      <Box paddingLeft="1em" paddingRight="1em" paddingTop="4px">
        <TextField
          //autoFocus
          margin="dense"
          autoComplete="off"
          variant="outlined"
          id="search_field"
          label="Search"
          type="search"
          fullWidth
          onChange={event => setSearch(event.target.value)}
        />
      </Box>
      <Box
        flex="1 1 auto"
        marginY="8px"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        <PilotSelectorList
          alreadyAdded={props.alreadyAdded}
          selected={selected}
          onPilotClicked={pilotClicked}
          search={search}
        />
      </Box>
      <DialogActions>
        <Button onClick={closeWindow} color="primary">
          Cancel
        </Button>
        <Button
          disabled={numSelected === 0}
          onClick={() => {
            props.onAddPilots(selected);
            closeWindow();
          }}
          color="primary"
        >
          Add
        </Button>
      </DialogActions>
    </SubWindow>
  );
};

export default pure(PilotSelector);
