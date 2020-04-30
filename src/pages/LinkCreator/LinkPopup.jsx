import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

export default function LinkPopup(props) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.link).then(
      function () {
        alert("Copied link to clipboard!");
      },
      function (err) {
        alert("Can't copy to clipboard:", err);
      }
    );
  };

  return (
    <Dialog open={props.link !== null} onClose={props.onClose}>
      <DialogTitle>{"Shareable Link:"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <a
            style={{ wordWrap: "break-word", wordBreak: "break-all" }}
            onClick={() => {
              copyToClipboard();
              window.event.preventDefault();
              return false;
            }}
            href={props.link}
          >
            {props.link}
          </a>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={copyToClipboard} color="primary" autoFocus>
          Copy
        </Button>
        <Button onClick={props.onClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
