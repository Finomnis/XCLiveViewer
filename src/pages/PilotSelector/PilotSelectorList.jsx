import React from "react";

import { CircularProgress } from "@material-ui/core";

import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";

import { arraysEqual } from "../../util/CompareArrays";
import { getGPSProvider } from "../../services/GPSProvider";
import { getDistance } from "geolib";
import { renderRow, TableHeader, rowHeight } from "./PilotSelectorListRenderer";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const filterPilotList = (pilotList, pilotInfos, search) => {
  const matchesSearch = (name) => {
    if (search === "") {
      return true;
    }
    return name.toLowerCase().includes(search.toLowerCase());
  };

  // Create virtual pilot if nobody found
  let filteredPilots = pilotList.filter((pilotId) => {
    return (
      matchesSearch(pilotInfos[pilotId].info.user.username) ||
      matchesSearch(pilotInfos[pilotId].info.user.fullname)
    );
  });

  // Add dummy pilot if list is empty and search string is valid
  if (filteredPilots.length === 0 && !/\s/.test(search) && search.length > 0) {
    filteredPilots.push(search);
  }

  return filteredPilots;
};

const sortPilotList = (pilotInfos, gps) => {
  if (gps) {
    // If gps, sort by distance
    const myPos = { lat: gps.coords.latitude, lng: gps.coords.longitude };
    let distances = Object.entries(pilotInfos).map(([pilotId, data]) => {
      const distance = getDistance(myPos, data.lastFix);
      return [pilotId, distance];
    });
    distances.sort((el1, el2) => el1[1] - el2[1]);
    const pilotIds = distances.map((el) => el[0]);
    return pilotIds;
  } else {
    // Else, sort by name
    let pilotIds = Object.keys(pilotInfos);
    pilotIds.sort();
    return pilotIds;
  }
};

// The list content
export default class PilotSelectorList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.gpsData = getGPSProvider().getData();
    const pilotInfos = getXContestInterface().pilotInfos.getValue();
    this.state = {
      didMount: false,
      pilotInfos: pilotInfos,
      sortedPilotList: sortPilotList(pilotInfos, this.gpsData),
    };
  }

  startRendering = () => {
    this.setState((state) => ({ ...state, didMount: true }));
  };

  componentDidMount() {
    getXContestInterface().pilotInfos.registerCallback(this.onNewPilotInfos);
    getGPSProvider().registerCallback(this.onNewGpsData);

    // This starts the actual rendering, as it can take quite a while.
    // setTimeout forces the browser to present before loading the table.
    // without setTimeout, the waiting symbol would never be shown.
    setTimeout(this.startRendering);
  }

  componentWillUnmount() {
    getXContestInterface().pilotInfos.unregisterCallback(this.onNewPilotInfos);
    getGPSProvider().unregisterCallback(this.onNewGpsData);
  }

  updatePilotListIfNecessary = () => {
    const newPilotList = sortPilotList(this.state.pilotInfos, this.gpsData);

    if (!arraysEqual(this.state.sortedPilotList, newPilotList))
      this.setState((state) => ({ ...state, sortedPilotList: newPilotList }));
  };

  onNewGpsData = (gpsData) => {
    // update only if gps position changed pilot list
    this.gpsData = gpsData;
    this.updatePilotListIfNecessary();
  };

  onNewPilotInfos = (pilotInfos) => {
    // Always update on new pilot infos
    this.setState((state) => ({
      ...state,
      pilotInfos: pilotInfos,
      sortedPilotList: sortPilotList(pilotInfos, this.gpsData),
    }));
  };

  onPilotClicked = (pilotId) => {
    if (this.props.onPilotClicked) this.props.onPilotClicked(pilotId);
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

    const displayedPilots = filterPilotList(
      this.state.sortedPilotList,
      this.state.pilotInfos,
      this.props.search
    );

    return (
      <React.Fragment>
        <TableHeader />
        <div style={{ flex: "1" }}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                width={width}
                height={height}
                itemCount={displayedPilots.length}
                itemSize={rowHeight}
                itemData={{
                  keys: displayedPilots,
                  data: this.state.pilotInfos,
                  selected: this.props.selected,
                  alreadyAdded: this.props.alreadyAdded,
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
