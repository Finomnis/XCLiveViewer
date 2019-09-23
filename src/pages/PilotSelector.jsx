import React from "react";
import { Box } from "@material-ui/core";

import {
  useXContestPilots,
  useXContestConnectionState
} from "../location_provider/XContest/XContestInterface";

const PilotSelector = () => {
  const connectionState = useXContestConnectionState();
  const pilotList = useXContestPilots();
  return (
    <React.Fragment>
      <Box>State: {connectionState}</Box>
      <Box>{pilotList.length}</Box>
    </React.Fragment>
  );
};

export default PilotSelector;
