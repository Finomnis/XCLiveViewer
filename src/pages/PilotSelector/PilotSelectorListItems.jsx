import React from "react";
import {
  TableRow,
  TableCell,
  Box,
  Typography,
  TableHead
} from "@material-ui/core";
import { LastFixState, LastFixArrow } from "../../util/LastFixState";

const importantDataDifferent = (prevData, nextData) => {
  if (prevData === nextData) return false;
  if (!prevData && !nextData) return false;
  if (!prevData || !nextData) return true;

  return (
    prevData.info.user.fullname !== nextData.info.user.fullname ||
    prevData.info.user.username !== nextData.info.user.username ||
    prevData.landed !== nextData.landed ||
    prevData.lastFix.timestamp !== nextData.lastFix.timestamp ||
    prevData.info.user.nationality.iso !== nextData.info.user.nationality.iso
  );
};
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

export class PilotSelectorListHeader extends React.PureComponent {
  state = {};

  render() {
    return (
      <TableHead>
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
      </TableHead>
    );
  }
}

export class PilotSelectorListEntry extends React.Component {
  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.disabled !== nextProps.disabled ||
      this.props.name !== nextProps.name ||
      this.props.selected !== nextProps.selected ||
      this.props.onClick !== nextProps.onClick ||
      importantDataDifferent(nextProps.data, this.props.data)
    );
  }

  handleClick = () => {
    this.props.onClick(this.props.name);
  };

  render() {
    const boxStyle = this.props.disabled
      ? { filter: "grayscale(100%) opacity(30%)" }
      : {};

    const columnContent = columns.map(column => {
      return (
        <TableCell key={column.id} align={column.align} padding="none">
          <Box style={boxStyle}>
            {column.render(this.props.name, this.props.data)}
          </Box>
        </TableCell>
      );
    });

    return (
      <TableRow selected={this.props.selected} onClick={this.handleClick}>
        {columnContent}
      </TableRow>
    );
  }
}
