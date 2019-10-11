import React from "react";
import { useState } from "react";
import { Dialog } from "@material-ui/core";
import { useHistory } from "../common/History";

// The difficult here is to fire exactly one history.back() for any case.
// Cases:
// - "open" changes to 'false'
// - "Dialog.onClose()" => same as previous, as can be forwarded
// - History gets reverted

const SubWindow = props => {
  const [open, _setOpen] = useState(false);
  const [historyOpen, _setHistoryOpen] = useState(false);
  const history = useHistory();

  const openWindow = () => {
    // TODO create history entry
    history.push(() => {
      _setOpen(false);
      props.onClose();
    });
    _setOpen(true);
    _setHistoryOpen(true);
  };

  // If we should be open, initiate a window opening.
  // Special case: if we just closed the window, don't immediately re-open it,
  // but signal the parent class to close instead.
  if (props.open && !open) {
    if (historyOpen) {
      // This creates an endless feedback loop if props.onClose doesn't set
      // props.open to false. Therefore we require props.onClose to do so.
      props.onClose();

      // To further prevent the feedback loop, we now set the history open state.
      // Now, if props.onClose failed to set props.open to false, the window
      // will immediately re-open.
      _setHistoryOpen(false);
    } else {
      openWindow();
    }
  }

  // If both the external and internal state agree that the window is now close,
  // reset the history state. The history state prevents the window
  // from immediately re-opening if the external and internal states disagree.
  if (historyOpen && !open && !props.open) {
    _setHistoryOpen(false);
  }

  // If we are open, the history entry still exists.
  // Therefore, go back in history if we get signalled to close.
  if (open && !props.open) {
    history.pop();
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        props.onClose();
      }}
      fullScreen={props.fullScreen}
      maxWidth={props.maxWidth}
      fullWidth={props.fullWidth}
    >
      {props.children}
    </Dialog>
  );
};

export default SubWindow;
