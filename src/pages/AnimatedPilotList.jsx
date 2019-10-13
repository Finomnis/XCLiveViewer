import React from "react";
import { Box } from "@material-ui/core";
import { getXContestInterface } from "../location_provider/XContest/XContestInterface";

const AnimatedPilotList = props => {
  const animatedData = getXContestInterface().animation.useAnimatedData();

  const content = Object.entries(props.pilots).map(([pilotId, pilotName]) => {
    let displayedName = pilotName;
    if (pilotName === null) {
      displayedName = pilotId;
    }

    let pilotDebugOutput = [];
    if (pilotId in animatedData) {
      const animatedPilotData = animatedData[pilotId];

      for (const key in animatedPilotData) {
        const dataElement = animatedPilotData[key];
        if (isNaN(dataElement)) {
          if (dataElement.length > 5) continue;
          for (const subKey in dataElement) {
            pilotDebugOutput.push(
              <tr key={key + subKey}>
                <td>{key + "." + subKey}</td>
                <td>{dataElement[subKey].toString()}</td>
              </tr>
            );
          }
        } else {
          pilotDebugOutput.push(
            <tr key={key}>
              <td>{key}</td>
              <td>
                {(Math.round(100 * animatedPilotData[key]) / 100).toString()}
              </td>
            </tr>
          );
        }
      }
    }

    return (
      <Box
        margin="10px"
        key={pilotId}
        onClick={() => props.removePilots([pilotId])}
      >
        {displayedName}
        <table>
          <tbody>{pilotDebugOutput}</tbody>
        </table>
      </Box>
    );
  });

  // console.log("Data:", animatedData);
  return (
    <Box height="100%" style={{ overflowY: "auto" }}>
      {content}
    </Box>
  );
};

export default AnimatedPilotList;
