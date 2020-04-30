import React from "react";

import {
  CircularProgress,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Checkbox,
  Typography,
} from "@material-ui/core";

// The list content
export default class PilotMultipleChoiceList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { didMount: false };
  }

  startRendering = () => {
    this.setState({ didMount: true });
  };

  componentDidMount() {
    // This starts the actual rendering, as it can take quite a while.
    // setTimeout forces the browser to present before loading the table.
    // without setTimeout, the waiting symbol would never be shown.
    setTimeout(this.startRendering);
  }

  onPilotClicked = (pilotId) => {
    if (this.props.onPilotClicked) this.props.onPilotClicked(pilotId);
  };

  getSortedPilotIds = () => {
    const pilots = Object.keys(this.props.pilots);

    pilots.sort((a, b) => {
      const nameA = this.props.pilots[a].name;
      const nameB = this.props.pilots[b].name;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    return pilots;
  };

  render() {
    if (!this.state.didMount) {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <CircularProgress disableShrink style={{ margin: "2em" }} />
        </div>
      );
    }

    const pilots = this.getSortedPilotIds();

    return (
      <Box overflow="scroll">
        <Table /*size="small"*/ style={{ overflow: "scroll" }}>
          <TableBody>
            {pilots.map((pilotId) => (
              <TableRow
                key={pilotId}
                onClick={() => this.onPilotClicked(pilotId)}
                selected={pilotId in this.props.selected}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={pilotId in this.props.selected} />
                </TableCell>
                <TableCell component="th" scope="row" padding="none">
                  <Typography variant="body2" component="span">
                    {this.props.pilots[pilotId].name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ paddingLeft: ".5em" }}
                    component="span"
                  >
                    [{pilotId}]
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  }
}
