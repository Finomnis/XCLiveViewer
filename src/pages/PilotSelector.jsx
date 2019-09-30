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
import { Button, Dialog, DialogActions, TextField } from "@material-ui/core";

import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@material-ui/core";

import { useXContestPilots } from "../location_provider/XContest/XContestInterface";

const columns = [
  {
    id: "name",
    label: "Name",
    minWidth: 0,
    render: row => {
      return (
        <React.Fragment>
          {row.user.fullname}
          <Typography
            component="span"
            variant="caption"
            color="textSecondary"
            style={{ paddingLeft: ".3em" }}
          >
            [{row.user.username}]
          </Typography>
        </React.Fragment>
      );
    }
  },
  {
    id: "country",
    label: "Country",
    minWidth: "4em",
    align: "right",
    render: row => {
      return (
        <React.Fragment>
          {row.user.nationality.iso}
          <Box
            fontSize="large"
            marginLeft="4px"
            boxShadow={1}
            style={{ verticalAlign: "middle" }}
            className={
              "flag-icon flag-icon-" + row.user.nationality.iso.toLowerCase()
            }
          ></Box>
        </React.Fragment>
      );
    }
  }
];

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
    }
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
    <Dialog open={props.open} onClose={closeWindow} fullScreen={fullScreen}>
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
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  component="th"
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPilots.map(row => {
              const username = row.info.user.username;

              const isItemSelected = isSelected(username);

              const itemDisabled = wasAlreadyAdded(username);
              const style = itemDisabled
                ? { filter: "grayscale(100%) opacity(30%)" }
                : {};

              const columnContent = columns.map(column => {
                return (
                  <TableCell key={column.id} align={column.align}>
                    <Box style={style}>{column.render(row.info)}</Box>
                  </TableCell>
                );
              });

              if (itemDisabled) {
                return <TableRow key={username}>{columnContent}</TableRow>;
              }

              return (
                <TableRow
                  key={username}
                  selected={isItemSelected}
                  onClick={event => handleClick(event, username)}
                >
                  {columnContent}
                </TableRow>
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
    </Dialog>
  );
};

export default PilotSelector;
