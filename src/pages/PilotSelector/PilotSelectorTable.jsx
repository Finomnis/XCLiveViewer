import React from "react";

import { Table, TableBody } from "@material-ui/core";

import { getXContestInterface } from "../../location_provider/XContest/XContestInterface";

import {
  PilotSelectorListEntry,
  PilotSelectorListHeader
} from "./PilotSelectorListItems";
import { arraysEqual } from "../../util/CompareArrays";
import { getGPSProvider } from "../../common/GPSProvider";
import { getDistance } from "geolib";

const computeDisplayedPilots = (pilotList, pilotInfos, search) => {
  const matchesSearch = name => {
    if (search === "") {
      return true;
    }
    return name.toLowerCase().includes(search.toLowerCase());
  };

  // Create virtual pilot if nobody found
  let filteredPilots = pilotList.filter(pilotId => {
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

const getSortedPilotList = (pilotInfos, gps) => {
  if (gps) {
    // If gps, sort by distance
    const myPos = { lat: gps.coords.latitude, lng: gps.coords.longitude };
    let distances = Object.entries(pilotInfos).map(([pilotId, data]) => {
      const distance = getDistance(myPos, data.lastFix);
      return [pilotId, distance];
    });
    distances.sort((el1, el2) => el1[1] - el2[1]);
    const pilotIds = distances.map(el => el[0]);
    return pilotIds;
  } else {
    // Else, sort by name
    let pilotIds = Object.keys(pilotInfos);
    pilotIds.sort();
    return pilotIds;
  }
};

// The table content
export default class PilotSelectorTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.gpsData = getGPSProvider().getData();
    const pilotInfos = getXContestInterface().pilotInfos.getValue();
    this.state = {
      pilotInfos: pilotInfos,
      sortedPilotList: getSortedPilotList(pilotInfos, this.gpsData)
    };
  }

  componentDidMount() {
    getXContestInterface().pilotInfos.registerCallback(this.onNewPilotInfos);
    getGPSProvider().registerCallback(this.onNewGpsData);
  }

  componentWillUnmount() {
    getXContestInterface().pilotInfos.unregisterCallback(this.onNewPilotInfos);
    getGPSProvider().unregisterCallback(this.onNewGpsData);
  }

  updatePilotListIfNecessary = () => {
    const newPilotList = getSortedPilotList(
      this.state.pilotInfos,
      this.gpsData
    );

    if (!arraysEqual(this.state.sortedPilotList, newPilotList))
      this.setState({ ...this.state, sortedPilotList: newPilotList });
  };

  onNewGpsData = gpsData => {
    // update only if gps position changed pilot list
    this.gpsData = gpsData;
    this.updatePilotListIfNecessary();
  };

  onNewPilotInfos = pilotInfos => {
    // Always update on new pilot infos
    this.setState({
      ...this.state,
      pilotInfos: pilotInfos,
      sortedPilotList: getSortedPilotList(pilotInfos, this.gpsData)
    });
  };

  onPilotClicked = pilotId => {
    if (this.props.onPilotClicked) this.props.onPilotClicked(pilotId);
  };

  render() {
    const isSelected = name => this.props.selected.indexOf(name) !== -1;
    const wasAlreadyAdded = name =>
      this.props.alreadyAdded.indexOf(name) !== -1;

    const displayedPilots = computeDisplayedPilots(
      this.state.sortedPilotList,
      this.state.pilotInfos,
      this.props.search
    );

    return (
      <Table stickyHeader size="small">
        <PilotSelectorListHeader />
        <TableBody>
          {displayedPilots.map(pilotId => {
            const isItemSelected = isSelected(pilotId);
            const itemDisabled = wasAlreadyAdded(pilotId);

            const pilotData = this.state.pilotInfos[pilotId];

            if (itemDisabled) {
              return (
                <PilotSelectorListEntry
                  key={pilotId}
                  name={pilotId}
                  data={pilotData}
                  disabled
                />
              );
            }

            return (
              <PilotSelectorListEntry
                key={pilotId}
                name={pilotId}
                data={pilotData}
                selected={isItemSelected}
                onEntryClicked={this.onPilotClicked}
              />
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
