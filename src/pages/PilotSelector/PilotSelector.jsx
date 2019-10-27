import React, { Component } from "react";
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

import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";
import SubWindow from "../../util/SubWindow";
import {
  PilotSelectorListEntry,
  PilotSelectorListHeader
} from "./PilotSelectorListItems";
import { arraysEqual } from "../../util/CompareArrays";
import { getGPSProvider } from "../../common/GPSProvider";
import { getDistance } from "geolib";

const computeDisplayedPilots = (pilotList, pilotInfos, search) => {
  const matchesSearch = name => {
    if (search === "") {
      return true;
    }
    return name.toLowerCase().includes(search.toLowerCase());
  };

  // Create virtual pilot if nobody found
  let filteredPilots = pilotList.filter(pilotId => {
    return (
      matchesSearch(pilotInfos[pilotId].info.user.username) ||
      matchesSearch(pilotInfos[pilotId].info.user.fullname)
    );
  });

  // Add dummy pilot if list is empty and search string is valid
  if (filteredPilots.length === 0 && !/\s/.test(search) && search.length > 0) {
    filteredPilots.push(search);
  }

  return filteredPilots;
};

const getSortedPilotList = (pilotInfos, gps) => {
  if (gps) {
    // If gps, sort by distance
    const myPos = { lat: gps.coords.latitude, lng: gps.coords.longitude };
    let distances = Object.entries(pilotInfos).map(([pilotId, data]) => {
      const distance = getDistance(myPos, data.lastFix);
      return [pilotId, distance];
    });
    distances.sort((el1, el2) => el1[1] - el2[1]);
    const pilotIds = distances.map(el => el[0]);
    return pilotIds;
  } else {
    // Else, sort by name
    let pilotIds = Object.keys(pilotInfos);
    pilotIds.sort();
    return pilotIds;
  }
};

// The table content
class PilotSelectorContent extends Component {
  constructor(props) {
    super(props);
    this.gpsData = getGPSProvider().getData();
    const pilotInfos = getXContestInterface().pilotInfos.getValue();
    this.state = {
      pilotInfos: pilotInfos,
      sortedPilotList: getSortedPilotList(pilotInfos, this.gpsData)
    };
  }

  componentDidMount() {
    getXContestInterface().pilotInfos.registerCallback(this.onNewPilotInfos);
    getGPSProvider().registerCallback(this.onNewGpsData);
  }

  componentWillUnmount() {
    getXContestInterface().pilotInfos.unregisterCallback(this.onNewPilotInfos);
    getGPSProvider().unregisterCallback(this.onNewGpsData);
  }

  updatePilotListIfNecessary = () => {
    const newPilotList = getSortedPilotList(
      this.state.pilotInfos,
      this.gpsData
    );

    if (!arraysEqual(this.state.sortedPilotList, newPilotList))
      this.setState({ ...this.state, sortedPilotList: newPilotList });
  };

  onNewGpsData = gpsData => {
    // update only if gps position changed pilot list
    this.gpsData = gpsData;
    this.updatePilotListIfNecessary();
  };

  onNewPilotInfos = pilotInfos => {
    // Always update on new pilot infos
    this.setState({
      ...this.state,
      pilotInfos: pilotInfos,
      sortedPilotList: getSortedPilotList(pilotInfos, this.gpsData)
    });
  };

  render() {
    const isSelected = name => this.props.selected.indexOf(name) !== -1;
    const wasAlreadyAdded = name =>
      this.props.alreadyAdded.indexOf(name) !== -1;

    const displayedPilots = computeDisplayedPilots(
      this.state.sortedPilotList,
      this.state.pilotInfos,
      this.props.search
    );

    return (
      <Table stickyHeader size="small">
        <TableHead>
          <PilotSelectorListHeader />
        </TableHead>
        <TableBody>
          {displayedPilots.map(pilotId => {
            const isItemSelected = isSelected(pilotId);
            const itemDisabled = wasAlreadyAdded(pilotId);

            const pilotData = this.state.pilotInfos[pilotId];

            if (itemDisabled) {
              return (
                <PilotSelectorListEntry
                  key={pilotId}
                  name={pilotId}
                  data={pilotData}
                  disabled
                />
              );
            }

            return (
              <PilotSelectorListEntry
                key={pilotId}
                name={pilotId}
                data={pilotData}
                selected={isItemSelected}
                onClick={() => this.props.onPilotClicked(pilotId)}
              />
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

// Base window, without the table
const PilotSelector = props => {
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
        <PilotSelectorContent
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

export default PilotSelector;
