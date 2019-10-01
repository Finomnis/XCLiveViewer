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
        pilotDebugOutput.push(
          <Box key={key}>{key + ": " + animatedPilotData[key]}</Box>
        );
      }
    }

    return (
      <Box key={pilotId} onClick={() => props.removePilots([pilotId])}>
        {displayedName}
        {pilotDebugOutput}
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
