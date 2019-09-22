import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorIcon from "@material-ui/icons/Error";

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2)
  }
}));

export const LoadingPage = ({ message, hideIf, subRef }) => {
  const classes = useStyles();
  return (
    <Box
      width="100%"
      height="100%"
      display={hideIf ? "none" : "flex"}
      alignItems="center"
      justifyContent="center"
      ref={subRef}
    >
      <Box textAlign="center">
        <CircularProgress className={classes.progress} />
        <Typography>{message}</Typography>
      </Box>
    </Box>
  );
};

export const ErrorPage = ({ message, hideIf }) => {
  const classes = useStyles();
  return (
    <Box
      width="100%"
      height="100%"
      display={hideIf ? "none" : "flex"}
      alignItems="center"
      justifyContent="center"
    >
      <Box textAlign="center">
        <ErrorIcon
          fontSize="large"
          color="error"
          className={classes.progress}
        />
        <Typography color="error">{message}</Typography>
      </Box>
    </Box>
  );
};
