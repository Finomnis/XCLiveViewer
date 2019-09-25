import React from "react";
import { Fab } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";

const Pilots = () => {
  const theme = useTheme();

  let content = [];
  for (let i = 0; i < 100; i++) {
    content.push(<Box>{i.toString()}</Box>);
  }

  return (
    <React.Fragment>
      <Box height="100%" overflow="scroll">
        {content}
      </Box>

      <Box
        position="absolute"
        bottom={theme.spacing(2)}
        right={theme.spacing(2)}
      >
        <Fab size="small" color="primary">
          <AddIcon />
        </Fab>
      </Box>
    </React.Fragment>
  );
};

export default Pilots;
