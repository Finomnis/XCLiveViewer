import React from "react";
import { Box } from "@material-ui/core";
import { getXContestInterface } from "../location_provider/XContest/XContestInterface";

const AnimatedPilotList = props => {
  const animatedData = getXContestInterface().animation.useAnimatedData();
  // console.log("Data:", animatedData);
  return (
    <Box height="100%" style={{ overflowY: "auto" }}>
      test!
    </Box>
  );
};

export default AnimatedPilotList;
