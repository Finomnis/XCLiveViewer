import React from "react";

import { AutoSizer, Table, Column } from "react-virtualized";

class AnimatedPilotListVirtualTable extends React.Component {
  rowGetter = ({ index }) => {
    return { row: this.props.rowIds[index] };
  };

  rowRenderer = ({ cellData }) => {
    return this.props.rowRenderer(cellData);
  };

  rowHeightGetter = ({ index }) => {
    return this.props.rowHeightGetter(this.props.rowIds[index]);
  };

  render() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            disableHeader
            rowCount={this.props.rowIds.length}
            rowHeight={this.rowHeightGetter}
            rowGetter={this.rowGetter}
          >
            <Column
              width={width}
              cellRenderer={this.rowRenderer}
              dataKey="row"
            />
          </Table>
        )}
      </AutoSizer>
    );
  }
}

export default AnimatedPilotListVirtualTable;
