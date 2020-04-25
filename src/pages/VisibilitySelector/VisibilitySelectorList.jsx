import React from "react";

import { CircularProgress, Divider } from "@material-ui/core";

import { renderRow, rowHeight } from "./VisibilitySelectorListRenderer";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

// The list content
export default class VisibilitySelectorList extends React.PureComponent {
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
      <React.Fragment>
        <Divider />
        <div style={{ flex: "1" }}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                width={width}
                height={height}
                itemCount={pilots.length}
                itemSize={rowHeight}
                itemData={{
                  keys: pilots,
                  data: this.props.pilots,
                  selected: this.props.selected,
                  onPilotClicked: this.onPilotClicked,
                }}
                itemKey={(index, { keys }) => keys[index]}
              >
                {renderRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      </React.Fragment>
    );
  }
}
