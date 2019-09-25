import React from "react";
import { Box } from "@material-ui/core";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@material-ui/core";

import {
  useXContestPilots,
  useXContestConnectionState
} from "../location_provider/XContest/XContestInterface";

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

const PilotSelector = () => {
  const connectionState = useXContestConnectionState();
  const pilotList = useXContestPilots();
  console.log(pilotList);
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default PilotSelector;
