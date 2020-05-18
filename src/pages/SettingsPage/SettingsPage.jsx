import React from "react";

import { List, Divider } from "@material-ui/core";
import { getSetting, Settings } from "../../common/PersistentState/Settings";
import { PageLayout } from "../../common/PersistentState/PageLayout";
import SubWindow from "../../util/SubWindow";
import {
  BooleanSetting,
  NumberSetting,
  MultipleChoiceSetting,
} from "./SettingsPageEntries";
import SettingsPageTitleBar from "./SettingsPageTitleBar";

const SettingsPage = (props) => {
  // Retreive the settings that enable/disable other settings
  const [settingLimitPaths] = getSetting(Settings.LIMIT_PATHS).use();
  const [settingFpsLimit] = getSetting(Settings.FPS_LIMIT).use();
  //const [settingLowLatency] = getSetting(Settings.LOW_LATENCY).use();

  return (
    <SubWindow fullScreen open={props.open} onClose={props.onClose}>
      <SettingsPageTitleBar onClose={props.onClose} />

      <List style={{ overflow: "auto" }}>
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
          secondaryText="required for advanced features"
        />

        {/* Prevent sleep */}
        <Divider />
        <BooleanSetting
          setting={Settings.PREVENT_SLEEP}
          primaryText="Prevent Sleep"
          secondaryText="keeps display on, useful for driving"
        />

        {/* Show offline pilots */}
        <Divider />
        <BooleanSetting
          setting={Settings.SHOW_OFFLINE_PILOTS}
          primaryText="Show Offline Pilots"
          secondaryText="displays last observed landing spot"
        />

        {/* Page Layout */}
        <Divider />
        <MultipleChoiceSetting
          setting={Settings.PAGE_LAYOUT}
          primaryText="Page Layout"
          secondaryText="explicitely sets the layout mode"
          choices={[
            { name: "Auto", value: PageLayout.AUTO },
            { name: "Phone", value: PageLayout.PHONE },
            { name: "Desktop", value: PageLayout.DESKTOP },
            { name: "Widget", value: PageLayout.WIDGET, disabled: true },
          ]}
        />
      </List>
    </SubWindow>
  );
};

export default SettingsPage;
