import React from "react";
import { Box } from "@material-ui/core";

import { useXContestPilots } from "../tools/XContestInterface";

const PilotSelector = () => {
  const pilotList = useXContestPilots();
  return <Box>{pilotList.length}</Box>;
};

export default PilotSelector;
