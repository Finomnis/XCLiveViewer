import { useEffect, useState } from "react";

export default function mapEventToState(
  eventTarget,
  messageName,
  initialState
) {
  return () => {
    const [innerState, setInnerState] = useState(initialState);

    useEffect(() => {
      let eventTargetObj =
        eventTarget instanceof Function ? eventTarget() : eventTarget;

      const onEvent = data => {
        setInnerState(data);
      };

      // Register
      eventTargetObj.addListener(messageName, onEvent);

      // Unregister on component unmount
      return () => {
        eventTargetObj.removeListener(messageName, onEvent);
      };
    }, []);

    return innerState;
  };
}
