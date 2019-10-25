import React from "react";

import { List, Divider } from "@material-ui/core";
import { getSetting, Settings } from "../../common/PersistentState/Settings";
import SubWindow from "../../util/SubWindow";
import { BooleanSetting, NumberSetting } from "./SettingsPageEntries";
import SettingsPageTitleBar from "./SettingsPageTitleBar";

const SettingsPage = props => {
  // Retreive the settings that enable/disable other settings
  const [settingLimitPaths] = getSetting(Settings.LIMIT_PATHS).use();
  const [settingFpsLimit] = getSetting(Settings.FPS_LIMIT).use();
  //const [settingLowLatency] = getSetting(Settings.LOW_LATENCY).use();

  return (
    <SubWindow fullScreen open={props.open} onClose={props.onClose}>
      <SettingsPageTitleBar onClose={props.onClose} />

      <List>
        {/* ANIMATION DELAY */}
        <BooleanSetting
          setting={Settings.LOW_LATENCY}
          primaryText="Low Latency Mode"
          secondaryText="disables animations"
        />
        {/*<NumberSetting
          primaryText="Animation Delay"
          secondaryText="70-120 sec (default: 80)"
          setting={Settings.ANIMATION_DELAY}
          disabled={settingLowLatency}
          unit="sec"
          min={70}
          max={120}
        />*/}

        {/* TRACK LENGTH */}
        <Divider />
        <BooleanSetting
          setting={Settings.LIMIT_PATHS}
          primaryText="Limit Track Length"
          secondaryText="prevents map clutter"
        />
        <NumberSetting
          primaryText="Track Length"
          secondaryText="Valid: 1-999 min"
          setting={Settings.PATH_LENGTH}
          disabled={!settingLimitPaths}
          unit="min"
          min={1}
          max={999}
        />

        {/* FRAMERATE */}
        <Divider />
        <BooleanSetting
          setting={Settings.FPS_LIMIT}
          primaryText="Limit Framerate"
          secondaryText="reduces energy consumption"
        />
        <NumberSetting
          primaryText="Framerate"
          secondaryText="Valid: 1-60 fps"
          setting={Settings.FPS_RATE}
          disabled={!settingFpsLimit}
          unit="fps"
          min={1}
          max={60}
        />

        {/* GPS */}
        <Divider />
        <BooleanSetting
          setting={Settings.GPS_ENABLED}
          primaryText="Enable GPS"
          secondaryText="Required for advanced features"
        />
      </List>
    </SubWindow>
  );
};

export default SettingsPage;
