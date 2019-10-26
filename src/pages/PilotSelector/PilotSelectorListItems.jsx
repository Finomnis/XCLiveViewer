import React from "react";
import { TableRow, TableCell, Box, Typography } from "@material-ui/core";
import LastFixState, { LastFixArrow } from "../../util/LastFixState";

const columns = [
  {
    id: "name",
    label: "Name",
    render: row => {
      return (
        <Box paddingLeft={1} paddingTop={1} paddingBottom={1}>
          <Typography variant="body2">{row.info.user.fullname}</Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            style={{ paddingLeft: ".5em" }}
          >
            [{row.info.user.username}]
          </Typography>
        </Box>
      );
    }
  },
  {
    id: "state",
    label: "State",
    align: "right",
    render: row => {
      return (
        <Box>
          <Box>
            <Typography variant="caption">
              <LastFixState
                timestamp={row.lastFix === null ? null : row.lastFix.timestamp}
                landed={row.landed}
                relative
              />
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              <LastFixArrow lastFix={row.lastFix} />
            </Typography>
          </Box>
        </Box>
      );
    }
  },
  {
    id: "country",
    label: "Country",
    align: "right",
    render: row => {
      return (
        <Box paddingRight={1} paddingLeft={1}>
          {row.info.user.nationality.iso}
          <Box
            fontSize="large"
            marginLeft="4px"
            boxShadow={1}
            style={{ verticalAlign: "middle" }}
            className={
              "flag-icon flag-icon-" +
              row.info.user.nationality.iso.toLowerCase()
            }
          ></Box>
        </Box>
      );
    }
  }
];

export const PilotSelectorListHeader = () => (
  <TableRow>
    {columns.map(column => (
      <TableCell
        key={column.id}
        align={column.align}
        style={{ width: column.width }}
        component="th"
      >
        {column.label}
      </TableCell>
    ))}
  </TableRow>
);

export const PilotSelectorListEntry = props => {
  const boxStyle = props.disabled
    ? { filter: "grayscale(100%) opacity(30%)" }
    : {};

  const columnContent = columns.map(column => {
    return (
      <TableCell key={column.id} align={column.align} padding="none">
        <Box style={boxStyle}>{column.render(props.data)}</Box>
      </TableCell>
    );
  });

  return (
    <TableRow selected={props.selected} onClick={props.onClick}>
      {columnContent}
    </TableRow>
  );
};
