import React from "react";
import { Fab } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(theme => ({
  addButton: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const Pilots = () => {
  const classes = useStyles();
  console.log(useTheme());
  return (
    <Fab className={classes.addButton} color="primary">
      <AddIcon />
    </Fab>
  );
};

export default Pilots;
