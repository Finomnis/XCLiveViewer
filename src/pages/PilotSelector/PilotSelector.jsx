import React from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Toolbar
} from "@material-ui/core";
import { useState } from "react";

import { lighten } from "@material-ui/core/styles";
import { Button, DialogActions, TextField } from "@material-ui/core";

import { Table, TableBody, TableHead } from "@material-ui/core";

import { useXContestPilots } from "../../location_provider/XContest/XContestInterface";
import SubWindow from "../../util/SubWindow";
import {
  PilotSelectorListEntry,
  PilotSelectorListHeader
} from "./PilotSelectorListItems";

function createPlaceholderPilot(name) {
  return {
    info: {
      user: {
        login: null,
        username: name,
        fullname: "Offline User",
        gender: "-",
        nationality: { iso: "--", name: "--" }
      },
      flightId: null
    },
    lastFix: null
  };
}

const PilotSelector = props => {
  const theme = useTheme();
  const pilotList = useXContestPilots();

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

  const handleClick = (_event, name) => {
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

  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const isSelected = name => selected.indexOf(name) !== -1;
  const wasAlreadyAdded = name => props.alreadyAdded.indexOf(name) !== -1;
  const matchesSearch = name => {
    if (search === "") {
      return true;
    }
    return name.toLowerCase().includes(search.toLowerCase());
  };

  // Create virtual pilot if nobody found
  let filteredPilots = Object.values(pilotList).filter(userData => {
    return (
      matchesSearch(userData.info.user.username) ||
      matchesSearch(userData.info.user.fullname)
    );
  });

  // Add dummy pilot if list is empty and search string is valid
  if (filteredPilots.length === 0 && !/\s/.test(search) && search.length > 0) {
    filteredPilots.push(createPlaceholderPilot(search));
  }

  return (
    <SubWindow
      open={props.open}
      onClose={closeWindow}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth={true}
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
      <Box flex="1 1 auto" marginY="8px" style={{ overflowY: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <PilotSelectorListHeader />
          </TableHead>
          <TableBody>
            {filteredPilots.map(row => {
              const username = row.info.user.username;
              const isItemSelected = isSelected(username);
              const itemDisabled = wasAlreadyAdded(username);

              if (itemDisabled) {
                return (
                  <PilotSelectorListEntry key={username} data={row} disabled />
                );
              }

              return (
                <PilotSelectorListEntry
                  key={username}
                  data={row}
                  selected={isItemSelected}
                  onClick={event => handleClick(event, username)}
                />
              );
            })}
          </TableBody>
        </Table>
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

export default PilotSelector;
