import React from "react";
import { TableCell, Typography, Checkbox } from "@material-ui/core";

export const rowHeight = 41;

class PilotSelectorListRow extends React.PureComponent {
  render() {
    const { fullname, username, selected } = this.props;

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Checkbox indeterminate={false} checked={selected} />
        <Typography variant="body2">{fullname}</Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ paddingLeft: ".5em" }}
        >
          [{username}]
        </Typography>
      </div>
    );
  }
}

export const renderRow = ({ data, index, style }) => {
  const pilotId = data.keys[index];
  const pilotInfos = data.data[pilotId];

  const fullname = pilotInfos.name;
  const selected = data.selected.indexOf(pilotId) !== -1;

  return (
    <TableCell
      component="div"
      variant="body"
      size="small"
      padding="none"
      style={{
        ...style,
        backgroundColor: selected ? "rgba(0, 0, 0, 0.04)" : undefined,
      }}
      onClick={() => {
        data.onPilotClicked(pilotId);
      }}
    >
      <PilotSelectorListRow
        fullname={fullname}
        username={pilotId}
        selected={selected}
      />
    </TableCell>
  );
};
