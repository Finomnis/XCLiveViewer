import React from "react";
import { Box, useMediaQuery, useTheme, Typography } from "@material-ui/core";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from "@material-ui/core";

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

const PilotSelector = props => {
  const theme = useTheme();
  const pilotList = useXContestPilots();
  const [selected, setSelected] = useState([]);

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

  // TODO add search bar
  // Create virtual pilot if nobody found
  // Add selectable pilots and functionality of the 'Add' button

  const isSelected = name => selected.indexOf(name) !== -1;

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
      <DialogTitle>Add new pilots:</DialogTitle>
      <DialogContent style={{ paddingLeft: 0, paddingRight: 0 }}>
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
            {pilotList
              .filter(
                row => props.alreadyAdded.indexOf(row.user.username) === -1
              )
              .map(row => {
                const isItemSelected = isSelected(row.user.username);
                return (
                  <TableRow
                    tabIndex={-1}
                    key={row.user.username}
                    selected={isItemSelected}
                    onClick={event => handleClick(event, row.user.username)}
                  >
                    {columns.map(column => {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.render(row)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.onAddPilots(selected);
            setSelected([]);
            props.onClose();
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
