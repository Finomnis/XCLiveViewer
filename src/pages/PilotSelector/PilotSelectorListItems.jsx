import React from "react";
import { TableRow, TableCell, Box, Typography } from "@material-ui/core";
import { LastFixState, LastFixArrow } from "../../util/LastFixState";

const columns = [
  {
    id: "name",
    label: "Name",
    render: (name, data) => {
      const fullname = data ? data.info.user.fullname : "Offline User";
      const username = data ? data.info.user.username : name;
      return (
        <Box paddingLeft={1} paddingTop={1} paddingBottom={1}>
          <Typography variant="body2">{fullname}</Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            style={{ paddingLeft: ".5em" }}
          >
            [{username}]
          </Typography>
        </Box>
      );
    }
  },
  {
    id: "state",
    label: "State",
    align: "right",
    render: (name, data) => {
      const lastFix = data ? data.lastFix : null;
      const timestamp = data ? data.lastFix.timestamp : null;
      const landed = data ? data.landed : null;
      return (
        <Box>
          <Box>
            <Typography variant="caption">
              <LastFixState timestamp={timestamp} landed={landed} relative />
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              <LastFixArrow lastFix={lastFix} />
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
    render: (name, data) => {
      const iso = data ? data.info.user.nationality.iso : "--";
      return (
        <Box paddingRight={1} paddingLeft={1}>
          {iso}
          <Box
            fontSize="large"
            marginLeft="4px"
            boxShadow={1}
            style={{ verticalAlign: "middle" }}
            className={"flag-icon flag-icon-" + iso.toLowerCase()}
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
        <Box style={boxStyle}>{column.render(props.name, props.data)}</Box>
      </TableCell>
    );
  });

  return (
    <TableRow selected={props.selected} onClick={props.onClick}>
      {columnContent}
    </TableRow>
  );
};
