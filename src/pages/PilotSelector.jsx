import React from "react";
import { Box, useMediaQuery, useTheme } from "@material-ui/core";

import { Button, Dialog, DialogTitle, DialogActions } from "@material-ui/core";

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
      return row.user.fullname;
    }
  },
  {
    id: "id",
    label: "ID",
    minWidth: 0,
    render: row => {
      return row.user.username;
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

  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  // TODO add search bar
  // Create virtual pilot if nobody found
  // Add selectable pilots and functionality of the 'Add' button

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={fullScreen}>
      <DialogTitle>Add new pilots:</DialogTitle>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {pilotList.map(row => {
            return (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={row.user.login}
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
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {}} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PilotSelector;
