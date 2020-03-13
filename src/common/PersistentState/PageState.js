import { registerPersistentState } from "./PersistentState";

const TabID = registerPersistentState("global.tab_id", 1);
const switchToMap = () => {
  TabID.setValue(0);
};

export default {
  TabID,
  switchToMap
};
