import React from "react";
import { TableCell, Typography, Box } from "@material-ui/core";
import { LastFixState, LastFixArrow } from "../../util/LastFixState";

export const headerHeight = 37;
export const rowHeight = 57;

export const TableHeader = () => {
  return (
    <TableCell
      component="div"
      variant="head"
      className="MuiTableCell-stickyHeader"
      style={{
        height: headerHeight,
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box"
      }}
    >
      <div style={{ flex: "1" }}>Name</div>
      <div style={{ width: "25%", textAlign: "right" }}>State</div>
      <div style={{ width: "27%", textAlign: "right" }}>Country</div>
    </TableCell>
  );
};

class PilotSelectorTableRow extends React.PureComponent {
  render() {
    const {
      fullname,
      username,
      lastFix,
      timestamp,
      landed,
      iso,
      selected,
      disabled,
      onClick
    } = this.props;

    const backgroundColor = selected ? "rgba(0, 0, 0, 0.04)" : null;
    console.log(selected, backgroundColor);

    return (
      <TableCell
        component="div"
        variant="body"
        padding="none"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          backgroundColor: selected ? "rgba(0, 0, 0, 0.04)" : null
        }}
        onClick={() => {
          onClick(username);
        }}
        className="Mui-selected"
        selected="1"
      >
        <Box flex="1" paddingLeft={1} paddingTop={1} paddingBottom={1}>
          <Typography variant="body2">{fullname}</Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            style={{ paddingLeft: ".5em" }}
          >
            [{username}]
          </Typography>
        </Box>
        <div style={{ width: "25%", textAlign: "right" }}>
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
        </div>
        <div style={{ width: "27%", textAlign: "right" }}>
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
        </div>
      </TableCell>
    );
  }
}

export const renderRow = ({ data, index, style }) => {
  const pilotId = data.keys[index];
  const pilotData = data.data[pilotId];

  const fullname = pilotData ? pilotData.info.user.fullname : "Offline User";
  const username = pilotData ? pilotData.info.user.username : pilotId;
  const lastFix = pilotData ? pilotData.lastFix : null;
  const timestamp = pilotData ? pilotData.lastFix.timestamp : null;
  const landed = pilotData ? pilotData.landed : null;
  const iso = pilotData ? pilotData.info.user.nationality.iso : "--";
  const selected = data.selected.indexOf(pilotId) !== -1;
  const alreadyAdded = data.alreadyAdded.indexOf(pilotId) !== -1;

  console.log(selected);

  return (
    <div style={style}>
      <PilotSelectorTableRow
        fullname={fullname}
        username={username}
        lastFix={lastFix}
        timestamp={timestamp}
        landed={landed}
        iso={iso}
        selected={selected}
        disabled={alreadyAdded}
        onClick={data.onPilotClicked}
      />
    </div>
  );
};
